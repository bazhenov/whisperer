package me.bazhenov.whisperer;

import ch.qos.logback.core.OutputStreamAppender;

import javax.servlet.AsyncContext;
import java.io.IOException;

class ClosingAsyncContextOutputStreamAppender<E> extends OutputStreamAppender<E> {

	private final AsyncContext context;

	public ClosingAsyncContextOutputStreamAppender(AsyncContext context) {
		this.context = context;
	}

	@Override
	protected void writeOut(E event) throws IOException {
		try {
			super.writeOut(event);
			getOutputStream().flush();
		} catch (IOException e) {
			// Устанавливаем таймаут в 1 мс, чтоб контейнер закрыл контекст. Явного способа закрытия контекста нет.
			context.setTimeout(1);
			throw e;
		}
	}
}
