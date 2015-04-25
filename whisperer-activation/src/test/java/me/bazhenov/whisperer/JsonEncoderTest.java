package me.bazhenov.whisperer;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.testng.annotations.Test;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;

import static java.lang.System.currentTimeMillis;
import static java.nio.charset.StandardCharsets.UTF_8;

public class JsonEncoderTest {

	private final ObjectMapper json = new ObjectMapper();

	@Test
	public void foo() throws IOException {
		JsonEncoder encoder = new JsonEncoder();
		ByteArrayOutputStream os = new ByteArrayOutputStream();
		encoder.init(os);
		encoder.doEncode(new LogEvent(currentTimeMillis(), "foo", "msg", "thread", "host", "error", new HashMap<>()));
		System.out.println(new String(os.toByteArray(), UTF_8));

	}
}
