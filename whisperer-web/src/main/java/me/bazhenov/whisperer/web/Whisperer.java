package me.bazhenov.whisperer.web;

import me.bazhenov.groovysh.spring.GroovyShellServiceBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.web.GzipFilterAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.context.web.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.net.URL;
import java.util.List;

import static com.google.common.collect.Lists.newArrayList;

@Configuration
@EnableAutoConfiguration(exclude = {GzipFilterAutoConfiguration.class})
@EnableConfigurationProperties(Whisperer.Config.class)
public class Whisperer extends SpringBootServletInitializer {

	@Autowired
	private Config config;

	public static void main(String[] args) {
		SpringApplication.run(Whisperer.class, args);
	}

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
		return builder.sources(Whisperer.class);
	}

	@Bean
	public WhispererController controller() {
		return new WhispererController(config.endpoints);
	}

	@Bean
	public GroovyShellServiceBean groovyShell() {
		GroovyShellServiceBean groovyShell = new GroovyShellServiceBean();
		groovyShell.setPort(6789);
		groovyShell.setLaunchAtStart(true);
		groovyShell.setPublishContextBeans(true);
		return groovyShell;
	}

	@PostConstruct
	public void init() {
	}

	@SuppressWarnings("UnusedDeclaration")
	@ConfigurationProperties
	static class Config {

		private List<URL> endpoints = newArrayList();
		private String name;

		public void setName(String name) {
			this.name = name;
		}

		public List<URL> getEndpoints() {
			return endpoints;
		}
	}
}
