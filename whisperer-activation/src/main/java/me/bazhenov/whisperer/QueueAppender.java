package me.bazhenov.whisperer;

import ch.qos.logback.core.AppenderBase;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.atomic.LongAdder;

public class QueueAppender<T> extends AppenderBase<T> {

	private final BlockingQueue<T> queue;
	private final LongAdder failedCounter = new LongAdder();

	public QueueAppender(int size) {
		queue = new ArrayBlockingQueue<>(size);
	}

	@Override
	protected void append(T event) {
		if (!queue.offer(event))
			failedCounter.increment();
	}

	public BlockingQueue<T> getQueue() {
		return queue;
	}
}
