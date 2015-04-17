package me.bazhenov.whisperer;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.encoder.EncoderBase;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

import static com.fasterxml.jackson.core.JsonGenerator.Feature.AUTO_CLOSE_TARGET;
import static com.fasterxml.jackson.databind.SerializationFeature.FLUSH_AFTER_WRITE_VALUE;
import static com.fasterxml.jackson.databind.SerializationFeature.INDENT_OUTPUT;
import static java.nio.charset.StandardCharsets.UTF_8;

class JsonEncoder extends EncoderBase<ILoggingEvent> {

	private final ObjectMapper json = new ObjectMapper()
		.configure(INDENT_OUTPUT, false)
		.configure(FLUSH_AFTER_WRITE_VALUE, false)
		.configure(AUTO_CLOSE_TARGET, false);

	private static final byte[] nl = "\n".getBytes(UTF_8);

	@Override
	public void doEncode(ILoggingEvent event) throws IOException {
		LogEvent e = new LogEvent(event.getLoggerName(), event.getMessage(),
			event.getThreadName(), "foo", event.getLevel().toString(), event.getMDCPropertyMap());
		doEncode(e);
	}

	void doEncode(LogEvent e) throws IOException {
		json.writeValue(outputStream, e);
		outputStream.write(nl);
		outputStream.flush();
	}

	@Override
	public void close() throws IOException {
	}
}
