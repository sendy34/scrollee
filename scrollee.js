/* eslint-disable */
(function ($) {
  var mobileCheck = function () {
    let check = false;
    (function (a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
          a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4)
        )
      )
        check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  };

  $.scrollee = function (element, options) {
    var defaults = {
      containerClass: "container",
      itemScroll: 1000,
      onInit: function () {}
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
      plugin.settings.onInit($element);
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

    var handleScroll = function (e, force) {
      var delta = $(window).scrollTop() - calc.offsetTop;
      var itemWithProgress =
        delta / (mobileCheck() ? 600 : plugin.settings.itemScroll);
      var itemIndex = Math.floor(itemWithProgress);

      if (typeof force === "undefined") {
        force = false;
      }

      if (itemIndex > prevItem) {
        dir = 1;
      } else if (itemIndex < prevItem) {
        dir = -1;
      } else {
        dir = 0;
      }

      if (dir === 0) {
        if (force) {
          dir = 1;
        } else {
          return;
        }
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
        .removeClass("anim-down");

      if (!force) {
        $element
          .find(".scrollee-backgrounds")
          .addClass(dir === 1 ? "anim-down" : "anim-up");
      } else {
      }

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

      var $overlay = $("<div />", { class: "scrollee-overlay" });
      $overlay.appendTo($dynamicContent);

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
        handleScroll({}, true);
        window.scrollTo(0, 0);
      });

      $dynamicContent.appendTo($element);
      $element.css({
        height:
          window.innerHeight +
          items.length * (mobileCheck() ? 600 : plugin.settings.itemScroll)
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
