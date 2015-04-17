package me.bazhenov.whisperer;

import ch.qos.logback.core.Context;
import ch.qos.logback.core.spi.ContextAware;
import ch.qos.logback.core.spi.LifeCycle;

import java.io.Closeable;
import java.io.IOException;
import java.util.Collection;
import java.util.LinkedList;

final class ActivationContext implements Closeable {

	private final Collection<LifeCycle> boundedObjects = new LinkedList<>();
	private final Context ctx;

	public ActivationContext(Context ctx) {
		this.ctx = ctx;
	}

	public <T extends LifeCycle & ContextAware> void registerAndStart(T obj) {
		obj.setContext(ctx);
		obj.start();
		boundedObjects.add(obj);
	}

	@Override
	public void close() throws IOException {
		for (LifeCycle obj : boundedObjects)
			obj.stop();
	}
}
