package me.bazhenov.whisperer.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import me.bazhenov.whisperer.LogEvent;

import java.io.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Collection;
import java.util.function.Consumer;

import static com.google.common.collect.Lists.newArrayList;
import static java.net.URLEncoder.encode;
import static java.util.Objects.requireNonNull;

public final class WhispererClient {

	private final Collection<URL> servers;
	private final Collection<Thread> threads = newArrayList();
	private final ObjectMapper json = new ObjectMapper();

	public WhispererClient(Collection<URL> servers) {
		this.servers = requireNonNull(servers);
	}

	public void start(Consumer<LogEvent> consumer, String key, String expectedValue) {
		for (URL server : servers) {
			Thread thread = new Thread(backgroundJob(consumer, server, key, expectedValue));
			threads.add(thread);
			thread.start();
		}
	}

	public Runnable backgroundJob(Consumer<LogEvent> consumer, URL server, String key, String expectedValue) {
		return () -> {
			try {
				URL url = createUrl(server, key, expectedValue);
				InputStream inputStream = url.openStream();
				try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
					String line;
					while ((line = reader.readLine()) != null)
						consumer.accept(json.readValue(line, LogEvent.class));
				}

			} catch (IOException e) {
				throw new RuntimeException(e);
			}
		};
	}

	private static URL createUrl(URL server, String key, String expectedValue)
		throws UnsupportedEncodingException, MalformedURLException {
		String s = server.toString();
		s += "?k=" + encode(key, "utf8") + "&v=" + encode(expectedValue, "utf8");
		return new URL(s);
	}
}
