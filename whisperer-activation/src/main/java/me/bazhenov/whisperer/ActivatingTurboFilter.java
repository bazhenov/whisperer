package me.bazhenov.whisperer;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.turbo.TurboFilter;
import ch.qos.logback.core.spi.FilterReply;
import org.slf4j.MDC;
import org.slf4j.Marker;

import java.util.Optional;

import static ch.qos.logback.core.spi.FilterReply.ACCEPT;
import static ch.qos.logback.core.spi.FilterReply.NEUTRAL;
import static java.util.Objects.requireNonNull;

public class ActivatingTurboFilter extends TurboFilter {

	private final Optional<String> loggerPrefix;
	private final Optional<Level> level;
	private final String key;
	private final String expectedValue;

	/**
	 * Этот блок кода необходим для исключения проблем с classloader'ом при использовании Logback в качестве
	 * системы логгирования для Jetty.
	 *
	 * В кратце проблема в том, что при вызове метода {@link #decide(Marker, Logger, Level, String, Object[], Throwable)}
	 * происходит загрузка классов:
	 * <ol>
	 * <li>{@link MDC}</li>;
	 * <li>{@link FilterReply}</li>.
	 * </ol>
	 * Так как classloader Jetty делегирует управление Logback, образуется рекурсия.
	 *
	 * Чтобы разорвать эту рекурсию мы делаем предзагрузку этих классов в статическом инициализаторе класса.
	 */
	static {
		MDC.get("foo");
		NEUTRAL.name();
	}

	public ActivatingTurboFilter(String key, String expectedValue, Optional<Level> level, Optional<String> loggerPrefix) {
		this.loggerPrefix = requireNonNull(loggerPrefix);
		this.level = requireNonNull(level);
		this.key = requireNonNull(key);
		this.expectedValue = requireNonNull(expectedValue);
	}

	@Override
	public FilterReply decide(Marker marker, Logger logger, Level level, String format, Object[] params, Throwable t) {
		if (!expectedValue.equals(MDC.get(key)))
			return NEUTRAL;
		return isLevelAndLoggerValid(level, logger.getName()) ? ACCEPT : NEUTRAL;
	}

	@SuppressWarnings("RedundantIfStatement")
	public boolean isLevelAndLoggerValid(Level level, String loggerName) {
		if (this.level.isPresent() && !level.isGreaterOrEqual(this.level.get()))
			return false;

		if (this.loggerPrefix.isPresent() && !loggerName.startsWith(this.loggerPrefix.get()))
			return false;

		return true;
	}
}
