package me.bazhenov.whisperer;

import ch.qos.logback.classic.LoggerContext;
import ch.qos.logback.classic.encoder.PatternLayoutEncoder;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.classic.turbo.MDCFilter;
import ch.qos.logback.classic.turbo.TurboFilter;
import ch.qos.logback.core.OutputStreamAppender;
import ch.qos.logback.core.filter.AbstractMatcherFilter;
import ch.qos.logback.core.spi.FilterReply;

import javax.servlet.AsyncContext;
import javax.servlet.AsyncEvent;
import javax.servlet.AsyncListener;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static ch.qos.logback.core.spi.FilterReply.ACCEPT;
import static ch.qos.logback.core.spi.FilterReply.DENY;
import static java.nio.charset.StandardCharsets.UTF_8;
import static org.slf4j.Logger.ROOT_LOGGER_NAME;
import static org.slf4j.LoggerFactory.getLogger;

public class WhispererServlet extends HttpServlet {

	@Override
	public void init() throws ServletException {
		super.init();
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		ch.qos.logback.classic.Logger rootLogger = (ch.qos.logback.classic.Logger) getLogger(ROOT_LOGGER_NAME);
		LoggerContext context = rootLogger.getLoggerContext();

		PatternLayoutEncoder encoder = new PatternLayoutEncoder();
		encoder.setCharset(UTF_8);
		encoder.setPattern("%d{HH:mm:ss} [%thread] %.-1level %logger{36} - %msg%n%ex");
		ActivationContext activationContext = new ActivationContext(context);
		activationContext.registerAndStart(encoder);

		String expectedUser = req.getParameter("user");
		if (expectedUser == null) {
			resp.sendError(400);
			return;
		}

		TurboFilter activator = createMdcActivator(expectedUser);
		activationContext.registerAndStart(activator);

		AsyncContext asyncContext = req.startAsync();
		asyncContext.addListener(new AsyncListener() {
			@Override
			public void onComplete(AsyncEvent event) throws IOException {
				context.getTurboFilterList().remove(activator);
				activationContext.close();
			}

			@Override
			public void onTimeout(AsyncEvent event) throws IOException {
				context.getTurboFilterList().remove(activator);
				activationContext.close();
			}

			@Override
			public void onError(AsyncEvent event) throws IOException {
				context.getTurboFilterList().remove(activator);
				activationContext.close();
			}

			@Override
			public void onStartAsync(AsyncEvent event) throws IOException {
			}
		});
		asyncContext.setTimeout(0);
		OutputStreamAppender<ILoggingEvent> appender = new ClosingAsyncContextOutputStreamAppender<>(asyncContext);
		appender.addFilter(new AbstractMatcherFilter<ILoggingEvent>() {
			@Override
			public FilterReply decide(ILoggingEvent event) {
				return event.getMDCPropertyMap().getOrDefault("user", "").equals(expectedUser)
					? ACCEPT
					: DENY;
			}
		});
		appender.setEncoder(encoder);
		appender.setOutputStream(asyncContext.getResponse().getOutputStream());
		activationContext.registerAndStart(appender);

		rootLogger.addAppender(appender);

		context.addTurboFilter(activator);
	}

	private static TurboFilter createMdcActivator(String expectedValue) {
		MDCFilter mdcActivator = new MDCFilter();
		mdcActivator.setMDCKey("user");
		mdcActivator.setValue(expectedValue == null ? "" : expectedValue);
		mdcActivator.setOnMatch("ACCEPT");
		return mdcActivator;
	}
}
