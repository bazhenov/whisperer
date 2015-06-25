function abbriviateHostName(hostName) {
	var pattern = /[a-z0-9-_]+(\.[a-z0-9-_]+)+/i;
	return pattern.test(hostName)
		? /^[^.]+/.exec(hostName)
		: null;
}

function htmlEncode(value) {
	//create a in-memory div, set it's inner text(which jQuery automatically encodes)
	//then grab the encoded contents back out.  The div never exists on the page.
	return $('<div/>').text(value).html();
}

function abbriviateGroup(group) {
	var abbr = group.replace(/([a-z])[a-z0-9-_]+\./ig, "$1.");
	return abbr != group ? abbr : null;
}

var FilterController = function ($container, onChange, positionSelector) {
	var self = this;
	self.$container = $container;
	self.itemSelector = positionSelector;
	self.positions = [];
	self.titlePreprocessor = undefined;
	self.onChange = onChange;
	self.template = _.template($("#filterTemplate").html());

	self.registerNewItem = function (item) {
		var position = positionSelector(item);
		if (!_.contains(self.positions, position)) {
			self.positions.push(position);
			self.refresh()
		}
	};

	self.refresh = function () {
		self.$container.html(self.template({title: "All", value: ""}));

		_.each(self.positions, function (i) {
			title = self.titlePreprocessor ? self.titlePreprocessor(i) : i;
			self.$container.append(self.template({title: title, value: i}));
		});

		self.$container.find("a").click(function (e) {
			var value = $(e.target).attr('data-value');
			self.$container.find("a").removeClass("active");
			$(e.target).addClass("active");
			self.onChange(value);
			return false;
		})
	}
};

var ListController = function ($container, template) {
	var self = this;

	self.$container = $container;

	self.template = template;
	self.groupFilter = "";
	self.threadFilter = "";
	self.hostFilter = "";
	self.items = [];

	self.isMatching = function (i) {
		if (self.groupFilter && self.groupFilter != i.group)
			return false;
		if (self.threadFilter && self.threadFilter != i.thread)
			return false;
		if (self.hostFilter && self.hostFilter != i.host)
			return false;

		return true;
	};

	self.clear = function() {
		self.items = [];
		self.refresh();
	}

	self.add = function (item) {
		if (self.isMatching(item))
			self.$container.append(self.template(item));
		self.items.push(item);
		if (self.registerNewItem)
			self.registerNewItem(item)
	};

	self.refresh = function () {
		self.$container.html("");

		_.chain(self.items)
			.filter(self.isMatching)
			.map(self.template)
			.each(function (i) {
				self.$container.append(i)
			});
	};
};