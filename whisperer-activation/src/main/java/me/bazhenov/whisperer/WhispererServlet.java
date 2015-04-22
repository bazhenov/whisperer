package me.bazhenov.whisperer;

import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.LoggerContext;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.classic.turbo.MDCFilter;
import ch.qos.logback.classic.turbo.TurboFilter;
import ch.qos.logback.core.OutputStreamAppender;
import ch.qos.logback.core.encoder.Encoder;

import javax.servlet.AsyncContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static org.slf4j.Logger.ROOT_LOGGER_NAME;
import static org.slf4j.LoggerFactory.getLogger;

public class WhispererServlet extends HttpServlet {

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		Logger rootLogger = (Logger) getLogger(ROOT_LOGGER_NAME);
		LoggerContext context = rootLogger.getLoggerContext();

		Encoder<ILoggingEvent> encoder = new JsonEncoder();
		ActivationContext activationContext = new ActivationContext(context);
		activationContext.registerAndStart(encoder);

		String key = req.getParameter("k");
		String expectedValue = req.getParameter("v");
		if (expectedValue == null || key == null || key.isEmpty()) {
			resp.sendError(400);
			return;
		}
		disableCache(resp);
		resp.setHeader("Content-Type", "application/json; boundary=NL");

		TurboFilter activator = createMdcActivator(key, expectedValue);
		activationContext.registerAndStart(activator);

		AsyncContext asyncContext = req.startAsync();

		asyncContext.setTimeout(0);
		OutputStreamAppender<ILoggingEvent> appender = new ClosingAsyncContextOutputStreamAppender<>(asyncContext);
		appender.addFilter(new MdcFilter(key, expectedValue));
		appender.setEncoder(encoder);
		appender.setOutputStream(asyncContext.getResponse().getOutputStream());
		activationContext.registerAndStart(appender);

		rootLogger.addAppender(appender);
		context.addTurboFilter(activator);

		asyncContext.addListener(new CleanupLoggerContextListener(context, rootLogger, activationContext, activator,
			appender));
	}

	private static void disableCache(HttpServletResponse resp) {
		resp.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
		resp.setHeader("Pragma", "no-cache");
		resp.setIntHeader("Expires", 0);
	}

	private static TurboFilter createMdcActivator(String key, String expectedValue) {
		MDCFilter mdcActivator = new MDCFilter();
		mdcActivator.setMDCKey(key);
		mdcActivator.setValue(expectedValue == null ? "" : expectedValue);
		mdcActivator.setOnMatch("ACCEPT");
		return mdcActivator;
	}
}
