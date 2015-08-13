package me.bazhenov.whisperer.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import me.bazhenov.whisperer.LogEvent;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.net.URL;
import java.util.Collection;
import java.util.Optional;
import java.util.function.Consumer;
import java.util.zip.GZIPOutputStream;

import static com.fasterxml.jackson.core.JsonGenerator.Feature.AUTO_CLOSE_TARGET;
import static com.fasterxml.jackson.databind.SerializationFeature.FLUSH_AFTER_WRITE_VALUE;
import static com.fasterxml.jackson.databind.SerializationFeature.INDENT_OUTPUT;
import static com.google.common.base.Strings.emptyToNull;
import static com.google.common.io.Closeables.close;
import static java.nio.charset.StandardCharsets.UTF_8;
import static java.util.Optional.ofNullable;

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
		return "redirect:/index.html";
	}

	@RequestMapping(value = "/stream", produces = "text/event-stream")
	public void doHandle(@RequestParam("k") String key,
											 @RequestParam("v") String expectedValue,
											 @RequestParam(value = "prefix", required = false) String prefix,
											 @RequestParam(value = "level", required = false) String level,
											 HttpServletResponse response) throws InterruptedException, IOException {

		response.setHeader("Content-Type", "text/event-stream");
		response.setHeader("Content-Encoding", "gzip");
		GZIPOutputStream gzip = new GZIPOutputStream(response.getOutputStream(), 512, true);
		WhispererClient client = new WhispererClient(endpoints);
		Consumer<Optional<LogEvent>> writeToOutputStream = event -> {
			try {
				synchronized (client) {
					if (event.isPresent()) {
						gzip.write("event: log\ndata: ".getBytes(UTF_8));
						json.writeValue(gzip, event.get());
						gzip.write(NL);
					} else {
						gzip.write("event: heartbeat\ndata: ".getBytes(UTF_8));
						gzip.write(NL);
					}
					gzip.flush();
				}
			} catch (IOException e) {
				try {
					close(gzip, true);
				} catch (IOException ignored) {
				}
				throw new UncheckedIOException(e);
			}
		};

		client.start(writeToOutputStream, key, expectedValue, ofNullable(emptyToNull(prefix)),
			ofNullable(emptyToNull(level)));
	}
}
