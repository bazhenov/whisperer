package me.bazhenov.whisperer;

import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.LoggerContext;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.classic.turbo.TurboFilter;
import ch.qos.logback.core.Appender;

import javax.servlet.AsyncEvent;
import javax.servlet.AsyncListener;
import java.io.IOException;

public class CleanupLoggerContextListener implements AsyncListener {

	private final LoggerContext context;
	private final Logger rootLogger;
	private final ActivationContext activationContext;
	private final TurboFilter activator;
	private final Appender<ILoggingEvent> appender;

	public CleanupLoggerContextListener(LoggerContext context, Logger rootLogger, ActivationContext activationContext,
																			TurboFilter activator, Appender<ILoggingEvent> appender) {
		this.context = context;
		this.rootLogger = rootLogger;
		this.activationContext = activationContext;
		this.activator = activator;
		this.appender = appender;
	}

	@Override
	public void onComplete(AsyncEvent event) throws IOException {
		context.getTurboFilterList().remove(activator);
		rootLogger.detachAppender(appender);
		activationContext.close();
	}

	@Override
	public void onTimeout(AsyncEvent event) throws IOException {
		context.getTurboFilterList().remove(activator);
		rootLogger.detachAppender(appender);
		activationContext.close();
	}

	@Override
	public void onError(AsyncEvent event) throws IOException {
		context.getTurboFilterList().remove(activator);
		rootLogger.detachAppender(appender);
		activationContext.close();
	}

	@Override
	public void onStartAsync(AsyncEvent event) throws IOException {
	}
}
