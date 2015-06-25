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
	private final ActivatingTurboFilter turboFilter;

	public MdcFilter(String key, String expectedValue, ActivatingTurboFilter turboFilter) {
		this.turboFilter = requireNonNull(turboFilter);
		this.key = requireNonNull(key);
		this.expectedValue = requireNonNull(expectedValue);
	}

	@Override
	public FilterReply decide(ILoggingEvent event) {
		if (!event.getMDCPropertyMap().getOrDefault(key, "").equals(expectedValue))
			return DENY;
		return turboFilter.isLevelAndLoggerValid(event.getLevel(), event.getLoggerName())
			? ACCEPT
			: DENY;
	}
}
