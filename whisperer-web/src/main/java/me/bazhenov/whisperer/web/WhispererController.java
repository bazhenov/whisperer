package me.bazhenov.whisperer.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import me.bazhenov.whisperer.LogEvent;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URL;
import java.util.Collection;
import java.util.function.Consumer;

import static com.fasterxml.jackson.core.JsonGenerator.Feature.AUTO_CLOSE_TARGET;
import static com.fasterxml.jackson.databind.SerializationFeature.FLUSH_AFTER_WRITE_VALUE;
import static com.fasterxml.jackson.databind.SerializationFeature.INDENT_OUTPUT;
import static java.nio.charset.StandardCharsets.UTF_8;

@Controller
public class WhispererController {

	private static final byte[] NL = "\n\n".getBytes(UTF_8);
	private final ObjectMapper json = new ObjectMapper()
		.configure(INDENT_OUTPUT, false)
		.configure(FLUSH_AFTER_WRITE_VALUE, false)
		.configure(AUTO_CLOSE_TARGET, false);
	private final Collection<URL> endpoints;

	public WhispererController(Collection<URL> endpoints) {
		this.endpoints = endpoints;
	}

	@RequestMapping("/")
	public String hello() {
		return "index";
	}

	@RequestMapping(value = "/stream", produces = "text/event-stream")
	public void doHandle(@RequestParam("k") String key, @RequestParam("v") String expectedValue,
											 HttpServletResponse response)
		throws InterruptedException, IOException {
		ServletOutputStream out = response.getOutputStream();
		response.setHeader("Content-Type", "text/event-stream");
		WhispererClient client = new WhispererClient(endpoints);
		Consumer<LogEvent> writeToOutputStream = event -> {
			try {
				synchronized (client) {
					out.write("event: log\ndata: ".getBytes(UTF_8));
					json.writeValue(out, event);
					out.write(NL);
					out.flush();
				}
			} catch (IOException e) {
				// TODO cleanup
				throw new RuntimeException(e);
			}
		};

		client.start(writeToOutputStream, key, expectedValue);
		Thread.sleep(600000);
	}
}
