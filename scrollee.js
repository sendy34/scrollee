/* eslint-disable */
(function ($) {
  $.scrollee = function (element, options) {
    var defaults = {
      containerClass: "container",
      itemScroll: 1000
      // onFoo: function() {}
    };

    var plugin = this;

    plugin.settings = {};

    var $element = $(element),
      element = element;

    var allItems = [];
    var categories = [];
    var filter = null;
    var items = [];

    function updateItemsBasedOnFilters() {
      // filter items based on filter
      if (!filter) {
        items = allItems;
      } else {
        items = [];
        for (var i = 0; i < allItems.length; i++) {
          if (allItems[i].category === filter) {
            items.push(allItems[i]);
          }
        }
      }
    }

    plugin.init = function () {
      plugin.settings = $.extend({}, defaults, options);
      $element.find(".scrollee-item").each(function () {
        var $this = $(this);
        allItems.push({
          title: $this.find(".scrollee-item-title").text(),
          image: $this.find(".scrollee-item-image").attr("src"),
          link: $this.find(".scrollee-item-link").attr("href"),
          category: $this.find(".scrollee-item-category").text().trim()
        });
      });

      // filter unique categories
      for (var i = 0; i < allItems.length; i++) {
        if (!categories.includes(allItems[i].category)) {
          categories.push(allItems[i].category);
        }
      }

      createStructure();
    };

    plugin.foo_public_method = function () {
      // code goes here
    };

    var calc = {
      offsetTop: 0,
      itemHeight: 100,
      miniItemHeight: 30
    };

    var doCalc = function () {
      calc.offsetTop = $element.offset().top;
      calc.itemHeight = $element.find(".scrollee-big-list").height();
      calc.miniItemHeight = $element.find(".scrollee-small-list li").height();
    };

    var prevItem = -1;
    var dir = 1;

    var handleScroll = function () {
      var delta = $(window).scrollTop() - calc.offsetTop;
      var itemWithProgress = delta / plugin.settings.itemScroll;
      var itemIndex = Math.floor(itemWithProgress);

      if (itemIndex > prevItem) {
        dir = 1;
      } else if (itemIndex < prevItem) {
        dir = -1;
      } else {
        dir = 0;
      }

      if (dir === 0) {
        return;
      }

      prevItem = itemIndex;

      if (itemIndex >= items.length) {
        itemIndex = items.length - 1;
      }

      $element.find(".scrollee-big-list ul").css({
        transform: "translate3d(0, " + -(itemIndex * calc.itemHeight) + "px, 0)"
      });

      $element
        .find(".scrollee-backgrounds")
        .removeClass("anim-up")
        .removeClass("anim-down")
        .addClass(dir === 1 ? "anim-down" : "anim-up");

      $element.find(".scrollee-backgrounds img").removeClass("prevActive");
      $element.find(".scrollee-backgrounds img.active").addClass("prevActive");
      $element.find(".scrollee-backgrounds img").removeClass("active");

      var $img = $element.find(
        ".scrollee-backgrounds img:nth-child(" + (itemIndex + 1) + ")"
      );

      $element.find(".scrollee-content > div").removeClass("active");
      var $contentItem = $element.find(
        ".scrollee-content > div:nth-child(" + (itemIndex + 1) + ")"
      );
      $contentItem.addClass("active");

      $img.addClass("active");

      $element.find(".scrollee-small-list ul").css({
        transform:
          "translate3d(0, " +
          -(itemIndex * calc.miniItemHeight + calc.miniItemHeight) +
          "px, 0)"
      });
    };

    var initEvents = function () {
      $(window).unbind("scroll", handleScroll);
      $(window).unbind("resize", doCalc);

      $(window).bind("resize", doCalc);
      $(window).bind("scroll", handleScroll);
    };

    var createStructure = function () {
      updateItemsBasedOnFilters();
      $element.removeClass("initialized");
      $element.find(".scrollee-dynamic").remove();
      var $dynamicContent = $("<div />", { class: "scrollee-dynamic" });

      var $list = $("<div />", { class: "scrollee-small-list" });
      var $listUl = $("<ul />");

      for (var i = 0; i < items.length; i++) {
        $listUl.append($("<li />", { text: items[i].title }));
      }
      $list.append($listUl);

      var $bigList = $("<div />", { class: "scrollee-big-list" });
      var $bigListUl = $("<ul />");
      for (var i = 0; i < items.length; i++) {
        var $a = $("<a />", { href: items[i].link, text: items[i].title });
        var $category = $("<div />", {
          class: "scrollee-item-category",
          text: items[i].category
        });
        $bigListUl.append($("<li />").append($category).append($a));
      }
      $bigList.append($bigListUl);

      var $backgrounds = $("<div />", { class: "scrollee-backgrounds" });
      var $backgroundImages = $("<div />", {
        class: "scrollee-backgrounds-images"
      });
      for (var i = 0; i < items.length; i++) {
        $backgroundImages.append(
          $("<img />", { class: i === 0 ? "active" : "", src: items[i].image })
        );
      }
      $backgrounds.append($backgroundImages);
      $backgrounds.append($("<div />", { class: "overlay" }));

      var $content = $("<div />", { class: "scrollee-content" });
      for (var i = 0; i < items.length; i++) {
        var $c = $("<div />");
        var $link = $("<a />", { href: items[i].link, text: "Learn More" });
        $link.appendTo($c);
        $c.appendTo($content);
      }

      $backgrounds.appendTo($dynamicContent);

      $("<div />", {
        class: "scrollee-content-wrap " + plugin.settings.containerClass
      })
        .append($("<div />", { class: "scrollee-content-top" }))
        .append($bigList)
        .append(
          $("<div />", { class: "scrollee-content-bottom" })
            .append($content)
            .append($list)
        )
        .appendTo($dynamicContent);

      // Create filters
      var $filtersWrap = $("<div />", {
        class: "scrollee-filters-wrap " + plugin.settings.containerClass
      });
      var $filters = $("<ul />", { class: "scrollee-filters" });
      var $all = $("<li />", {
        "data-filter": "",
        class: !filter ? "active" : "",
        text: "All"
      });
      $all.appendTo($filters);
      for (var i = 0; i < categories.length; i++) {
        $filters.append(
          $("<li />", {
            class: filter === categories[i] ? "active" : "",
            "data-filter": categories[i],
            text: categories[i]
          })
        );
      }
      $filters.appendTo($filtersWrap);
      $filtersWrap.appendTo($dynamicContent);

      $filters.on("click", "li", function () {
        $filters.find("li").removeClass("active");
        $(this).addClass("active");

        filter = $(this).attr("data-filter") || null;
        createStructure();
        window.scrollTo(0, 0);
      });

      $dynamicContent.appendTo($element);
      $element.css({
        height: window.innerHeight + items.length * plugin.settings.itemScroll
      });
      $element.addClass("initialized");

      doCalc();
      initEvents();
      handleScroll();
    };

    plugin.init();
  };

  $.fn.scrollee = function (options) {
    return this.each(function () {
      if (undefined === $(this).data("scrollee")) {
        var plugin = new $.scrollee(this, options);
        $(this).data("scrollee", plugin);
      }
    });
  };
})(jQuery);
