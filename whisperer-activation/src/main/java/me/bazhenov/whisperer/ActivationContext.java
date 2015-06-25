package me.bazhenov.whisperer;

import ch.qos.logback.classic.LoggerContext;
import ch.qos.logback.classic.turbo.TurboFilter;
import ch.qos.logback.core.spi.ContextAware;
import ch.qos.logback.core.spi.LifeCycle;
import org.slf4j.Logger;

import java.io.Closeable;
import java.io.IOException;
import java.util.Collection;
import java.util.LinkedList;

import static java.util.Objects.requireNonNull;
import static org.slf4j.LoggerFactory.getLogger;

final class ActivationContext implements Closeable {

	private final Collection<LifeCycle> boundedObjects = new LinkedList<>();
	private final LoggerContext ctx;
	private static final Logger log = getLogger(ActivationContext.class);

	public ActivationContext(LoggerContext ctx) {
		this.ctx = requireNonNull(ctx);
	}

	public <T extends LifeCycle & ContextAware> T registerAndStart(T obj) {
		obj.setContext(ctx);
		obj.start();
		boundedObjects.add(obj);
		return obj;
	}

	@Override
	public void close() throws IOException {
		for (LifeCycle obj : boundedObjects)
			try {
				if (obj instanceof TurboFilter)
					ctx.getTurboFilterList().remove(obj);
				obj.stop();
			} catch (RuntimeException e) {
				log.warn("Logback deregeristration failed", e);
			}
	}
}
