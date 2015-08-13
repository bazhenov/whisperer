package me.bazhenov.whisperer.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import me.bazhenov.whisperer.LogEvent;

import java.io.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Collection;
import java.util.Optional;
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

	public void start(Consumer<Optional<LogEvent>> consumer, String key, String expectedValue, Optional<String> prefix,
										Optional<String> level)
		throws InterruptedException, UnsupportedEncodingException, MalformedURLException {

		for (URL server : servers) {
			URL url = createUrl(server, key, expectedValue, prefix, level);
			Thread thread = new Thread(backgroundJob(consumer, url));
			threads.add(thread);
			thread.start();
		}
		for (Thread thread : threads)
			thread.join();
	}

	public Runnable backgroundJob(Consumer<Optional<LogEvent>> consumer, URL url) {
		return () -> {
			try {
				InputStream inputStream = url.openStream();
				try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
					String line;
					while ((line = reader.readLine()) != null)
						if (!line.isEmpty())
							consumer.accept(Optional.of(json.readValue(line, LogEvent.class)));
						else
							consumer.accept(Optional.empty());
				}

			} catch (IOException e) {
				throw new UncheckedIOException(e);
			}
		};
	}

	private static URL createUrl(URL server, String key, String expectedValue, Optional<String> prefix,
															 Optional<String> level)
		throws UnsupportedEncodingException, MalformedURLException {
		String s = server.toString();
		s += "?" + urlPair("k", key);
		s += "&" + urlPair("v", expectedValue);
		s += prefix.map(p -> "&" + urlPair("prefix", p)).orElse("");
		s += level.map(l -> "&" + urlPair("level", l)).orElse("");
		return new URL(s);
	}

	private static String urlPair(String key, String value) {
		try {
			return key + "=" + encode(value, "utf8");
		} catch (UnsupportedEncodingException e) {
			throw new RuntimeException(e);
		}
	}
}
