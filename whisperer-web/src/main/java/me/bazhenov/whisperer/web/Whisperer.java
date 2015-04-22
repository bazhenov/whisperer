package me.bazhenov.whisperer.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.util.List;

import static com.google.common.collect.Lists.newArrayList;

@Configuration
@EnableAutoConfiguration
@EnableConfigurationProperties(Whisperer.Config.class)
public class Whisperer {

	@Autowired
	private Config config;

	public static void main(String[] args) {
		SpringApplication.run(Whisperer.class, args);
	}

	@Bean
	public WhispererController controller() {
		return new WhispererController();
	}

	@PostConstruct
	public void init() {
	}

	@SuppressWarnings("UnusedDeclaration")
	@ConfigurationProperties
	static class Config {

		private List<String> endpoints = newArrayList();
		private String name;

		public void setName(String name) {
			this.name = name;
		}

		public List<String> getEndpoints() {
			return endpoints;
		}
	}
}
