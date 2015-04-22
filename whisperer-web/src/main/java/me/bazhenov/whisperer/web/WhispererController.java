package me.bazhenov.whisperer.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class WhispererController {

	@RequestMapping("/")
	public String hello() {
		return "index";
	}
}
