package me.bazhenov.whisperer;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.LoggerContext;
import ch.qos.logback.classic.spi.ILoggingEvent;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Optional;
import java.util.concurrent.BlockingQueue;

import static ch.qos.logback.classic.Level.TRACE;
import static com.fasterxml.jackson.core.JsonGenerator.Feature.AUTO_CLOSE_TARGET;
import static com.fasterxml.jackson.databind.SerializationFeature.FLUSH_AFTER_WRITE_VALUE;
import static com.fasterxml.jackson.databind.SerializationFeature.INDENT_OUTPUT;
import static java.lang.Thread.currentThread;
import static java.nio.charset.StandardCharsets.UTF_8;
import static org.slf4j.Logger.ROOT_LOGGER_NAME;
import static org.slf4j.LoggerFactory.getLogger;

public class WhispererServlet extends HttpServlet {

	private static final byte[] nl = "\n".getBytes(UTF_8);

	private final ObjectMapper json = new ObjectMapper()
		.configure(INDENT_OUTPUT, false)
		.configure(FLUSH_AFTER_WRITE_VALUE, false)
		.configure(AUTO_CLOSE_TARGET, false);

	private final String hostName;

	public WhispererServlet() throws UnknownHostException {
		hostName = InetAddress.getLocalHost().getHostName();
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		Logger rootLogger = (Logger) getLogger(ROOT_LOGGER_NAME);
		LoggerContext context = rootLogger.getLoggerContext();

		String key = req.getParameter("k");
		String expectedValue = req.getParameter("v");
		if (expectedValue == null || key == null || key.isEmpty()) {
			resp.sendError(400, "Incorrect activation key/value pair");
			return;
		}
		String loggerPrefix = req.getParameter("prefix");
		Level desiredLevel = Level.toLevel(req.getParameter("level"), TRACE);

		disableCache(resp);
		resp.setHeader("Content-Type", "application/json; boundary=NL");

		try (ActivationContext activationContext = new ActivationContext(context)) {
			ActivatingTurboFilter activator = activationContext.registerAndStart(new ActivatingTurboFilter(key, expectedValue,
				Optional.of(desiredLevel), Optional.ofNullable(loggerPrefix)));

			QueueAppender<ILoggingEvent> appender = new QueueAppender<>(500);
			appender.addFilter(activationContext.registerAndStart(new MdcFilter(key, expectedValue, activator)));
			activationContext.registerAndStart(appender);

			rootLogger.addAppender(appender);
			context.addTurboFilter(activator);

			BlockingQueue<ILoggingEvent> queue = appender.getQueue();
			OutputStream outputStream = resp.getOutputStream();
			while (!currentThread().isInterrupted()) {
				ILoggingEvent event = queue.take();
				try {
					send(event, outputStream);
				} catch (IOException e) {
					break;
				}
				if (queue.isEmpty())
					outputStream.flush();
			}
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();
		}
	}

	public void send(ILoggingEvent event, OutputStream outputStream) throws IOException {
		LogEvent e = new LogEvent(event.getTimeStamp(), event.getLoggerName(), event.getFormattedMessage(),
			event.getThreadName(), hostName, event.getLevel().toString(), event.getMDCPropertyMap());
		json.writeValue(outputStream, e);
		outputStream.write(nl);
	}

	private static void disableCache(HttpServletResponse resp) {
		resp.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
		resp.setHeader("Pragma", "no-cache");
		resp.setIntHeader("Expires", 0);
	}
}
