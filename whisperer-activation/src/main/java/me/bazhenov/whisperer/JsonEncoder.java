package me.bazhenov.whisperer;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.encoder.EncoderBase;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

import static com.fasterxml.jackson.databind.SerializationFeature.*;

class JsonEncoder extends EncoderBase<ILoggingEvent> {

	private final ObjectMapper json = new ObjectMapper()
		.configure(INDENT_OUTPUT, false)
		.configure(FLUSH_AFTER_WRITE_VALUE, true)
		.configure(CLOSE_CLOSEABLE, false);

	@Override
	public void doEncode(ILoggingEvent event) throws IOException {
		LogEvent e = new LogEvent(event.getLoggerName(), event.getMessage(),
			event.getThreadName(), "foo", event.getLevel().toString(), event.getMDCPropertyMap());
		doEncode(e);
	}

	void doEncode(LogEvent e) throws IOException {
		json.writeValue(outputStream, e);
	}

	@Override
	public void close() throws IOException {
	}
}
