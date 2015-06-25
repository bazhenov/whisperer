package com.farpost.spring;

import me.bazhenov.whisperer.WhispererServlet;
import org.slf4j.Logger;
import org.slf4j.MDC;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.context.embedded.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.net.UnknownHostException;

import static org.slf4j.LoggerFactory.getLogger;

@EnableAutoConfiguration
@Configuration
@Controller
public class WhispererServer {

	private static final Logger log = getLogger(WhispererServer.class);

	public static void main(String[] args) {
		SpringApplication.run(WhispererServer.class, args);
	}

	@RequestMapping("/")
	@ResponseBody
	public String hello(@RequestParam(defaultValue = "") String user) {
		MDC.put("user", user);
		log.trace("Fucking shit happened");
		MDC.remove("user");
		return "Hello";
	}

	@Bean
	public ServletRegistrationBean registerServlets() throws UnknownHostException {
		return new ServletRegistrationBean(new WhispererServlet(), "/whisperer");
	}
}
