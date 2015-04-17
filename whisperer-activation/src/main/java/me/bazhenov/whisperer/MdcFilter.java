package me.bazhenov.whisperer;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.filter.AbstractMatcherFilter;
import ch.qos.logback.core.spi.FilterReply;

import static ch.qos.logback.core.spi.FilterReply.ACCEPT;
import static ch.qos.logback.core.spi.FilterReply.DENY;
import static java.util.Objects.requireNonNull;

public class MdcFilter extends AbstractMatcherFilter<ILoggingEvent> {

	private final String key;
	private final String expectedValue;

	public MdcFilter(String key, String expectedValue) {
		this.key = requireNonNull(key);
		this.expectedValue = requireNonNull(expectedValue);
	}

	@Override
	public FilterReply decide(ILoggingEvent event) {
		return event.getMDCPropertyMap().getOrDefault(key, "").equals(expectedValue)
			? ACCEPT
			: DENY;
	}
}
