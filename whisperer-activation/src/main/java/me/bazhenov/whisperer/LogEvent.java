package me.bazhenov.whisperer;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.Map;

public final class LogEvent {

	private final long timeStamp;
	private final String group;
	private final String message;
	private final List<String> arguments;
	private final String thread;
	private final String host;
	private final String level;
	private final Map<String, String> mdc;

	@JsonCreator
	public LogEvent(@JsonProperty("timestamp") long timeStamp, @JsonProperty("group") String group,
									@JsonProperty("message") String message, @JsonProperty("args") List<String> arguments,
									@JsonProperty("thread") String thread, @JsonProperty("host") String host,
									@JsonProperty("level") String level, @JsonProperty("mdc") Map<String, String> mdc) {
		this.timeStamp = timeStamp;
		this.group = group;
		this.message = message;
		this.arguments = arguments;
		this.thread = thread;
		this.host = host;
		this.level = level;
		this.mdc = mdc;
	}

	@JsonProperty("timestamp")
	public long getTimeStamp() {
		return timeStamp;
	}

	@JsonProperty("group")
	public String getGroup() {
		return group;
	}

	@JsonProperty("message")
	public String getMessage() {
		return message;
	}

	@JsonProperty("thread")
	public String getThread() {
		return thread;
	}

	@JsonProperty("host")
	public String getHost() {
		return host;
	}

	@JsonProperty("level")
	public String getLevel() {
		return level;
	}

	@JsonProperty("args")
	public List<String> getArguments() {
		return arguments;
	}

	@JsonProperty("mdc")
	public Map<String, String> getMdc() {
		return mdc;
	}
}
