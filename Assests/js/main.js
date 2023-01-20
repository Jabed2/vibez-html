
$(document).ready(function () {
    navW();
    theme_mood();
    $(window).resize(function () { navW(); });
    widgetTitleNavCtrl();
    $('img.lazyload').lazyload();
    commentInfo();
    toggleArchive();
    $('.blog-pager-load-more').on('click', function (ele) {
        ele.preventDefault();
        let l = $(this).attr('href');
        let btnV = $(this).html();
        ajaxPost(l, btnV);
        $(this).data('disable', 'true');
    });
    postDataLoad();

}); // End Document Ready Function


/*
  ==== Ajax Post Label Control Function ====
*/
function labelCtrl(id) {
    let lb = $(id).data('label'), pr = $(id).parent(), vbsec = $(id).parents('.vb-section').attr('id'), ll = pr.html(), prCls = pr.attr('class'), url = '/feeds/posts/default?alt=json&max-results=4&q=label:' + lb, parentE = $(id).parents('.ajaxFn'); $sText = $(id).parents('.vb-widget-nav').find('.actext').html(lb); navW(); let nav = '<nav class="vb-widget-tile-nav"><div class="vb-widget-nav-wrap"><div class="nav-widget-title vb-align-self-c"><h4 class="ajax-title">' + lb + '</h4></div> <div class="vb-widget-nav position-relative"><div class="nav-opening" onclick="nav_opening(this)"><span class="actext pe-2"></span><i class="bi bi-chevron-double-down"></i></div><ul class="' + prCls + '">' + ll + '</ul></div></div></nav>'; ajaxJsonD(url, nav, parentE, vbsec);
} // End labelCtrl Function

/*
  ==== Ajax Post Nav Opening Function ====
*/
function nav_opening(ele) { $prnt = $(ele).parent(); $(ele).parent().find('.vb-wdget-nav-items').slideToggle(); } //End nav_opening Nav function


function toggleArchive() { $('.open-archive').on('click', function (e) { e.preventDefault(); let paren = $(this).parents('.parent-list-archive'); paren.find('.sub-list-archive').slideToggle(); }); } // End toggleArchive function

function navW() { $('.vb-widget-tile-nav').each(function (i, ele) { let el = $(this), nw = el.width(), nopn = el.find('.nav-opening'), navM = el.find('.vb-wdget-nav-items'), acT = navM.find('.nav-item.active a').text(); nopn.find('.actext').html(acT); if (nw < 600) { navM.addClass('vb-wdget-nav-sm'); navM.hide(); nopn.show(); } else { navM.removeClass('vb-wdget-nav-sm'); navM.show(); nopn.hide(); } }); } // End navW function

/*
  ==== Widget Title Navbar Control Function ====
*/
function widgetTitleNavCtrl() {
    $('.secondar-nav-menu').submenu();
    $('.dropdown-toggle').on('click', function () { $parent = $(this).parent(); $parent.find('.dropdown-menu').slideToggle(); }); // End dropdown-toggle Click 
}  // End widgetTitleNavCtrl function


/*
  ==== Ajax Post fetch For main post ====
*/
function ajaxPost(ur, e) {
    $.ajax({
        type: "GET", url: ur, beforeSend: function () { $(".blog-pager-load-more").html('<div style="width : 15px; height : 15px;" class="spinner-grow" role="status"></div><span class="ps-2">Loading</span>'); },
        success: function (t) { mainPostLoad(t); $("img.lazyload").lazyload(); },
        error: function (t) { },
        complete: function () { },
        dataType: "html"
    })
} // End ajaxPost function

function mainPostLoad(t) {
    let noC = $(t).find(".blog-pager").html(), e = $(t).find(".vb-main-posts .posts").html(), a = $(t).find(".blog-pager-load-more").html(), s = $(t).find(".blog-pager-load-more").attr("href"); $(".vb-main-posts .posts").append(e); if (null == s || "" === s) { $(".blog-pager-load-more").hide(); $(".blog-pager").html(noC); }
    else { $(".blog-pager-load-more").attr("href", s); $(".blog-pager-load-more").html(a); }
} // End mainPostLoad Function

function postDataLoad() {
    $('.ajaxFn').each(function (i, e) {
        let singleP = $(this).parents('.item-view').length, fl = '', that = $(this), navItem = '', firstL, navC = '', nav = '', vbsec = that.parents('.vb-section').attr('id'), content = that.data('content'), arrC = content.split(','), text = arrC[2].replaceAll('/', ','), dataL = JSON.parse(text); firstL = dataL[0]; if (singleP == 1 && vbsec == 'vb-sidebar') {
            fl = $('#mian-posts').find('.post-label-link').eq(0).text(); let url = 'https://vibez-preview.blogspot.com/feeds/posts/default?alt=json&max-results=4&q=label:' + fl;
            nav = '<nav class="vb-widget-tile-nav"><div class="vb-widget-nav-wrap"><div class="nav-widget-title vb-align-self-c"><h4 class="ajax-title">Related Post</h4></div> <div class="vb-widget-nav position-relative"></div></div></nav>'; ajaxJsonD(url, nav, that, vbsec);
        } else {
            if (dataL.length == 1) { navItem = ' '; } else {
                dataL.forEach(function (item, index) { let cl = index == 0 ? 'active' : ''; navItem = navItem + '<li class="nav-item ' + cl + '" onClick="labelCtrl(this)" data-label="' + item + '" data-bs-toggle="tab" role="tab" aria-controls="nav-profile" aria-selected="false"><a class="nav-link ">' + item + '</a></li>'; }); // End Foreach Loop
            } // Else if
            navC = (dataL.length == 1) ? ' ' : '<div class="nav-opening" onclick="nav_opening(this)"><span class="actext pe-2"></span><i class="bi bi-chevron-double-down"></i></div><ul class="vb-wdget-nav-items nav">' + navItem + '</ul>'; let url = 'https://vibez-preview.blogspot.com/feeds/posts/default?alt=json&max-results=4&q=label:' + firstL; nav = '<nav class="vb-widget-tile-nav"><div class="vb-widget-nav-wrap"><div class="nav-widget-title vb-align-self-c"><h4 class="ajax-title">' + firstL + '</h4></div> <div class="vb-widget-nav position-relative">' + navC + '</div></div></nav>'; ajaxJsonD(url, nav, that, vbsec);
        }
    }); // End .ajaxFn Each Function
} // End postDataLoad function

/*
  ==== Ajax Post Fetch for specific label ====
*/
function ajaxJsonD(u, nav, parentE, vbsec) {
    $.ajax({
        type: "GET", url: u,
        beforeSend: function () { parentE.find('.posts').html(' '); parentE.append('<div class="post-preloader d-flex justify-content-center align-items-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>'); },
        success: function (t) {
            let e = "", a = t.feed.entry, s = a.length, vb_class = ''; if (vbsec === 'vb-sidebar' || vbsec === 'vb-footer') { vb_class = 'col-12 col-sm-12 col-md-6 col-lg-12'; } else { vb_class = 'col-12 col-md-6'; } for (let o = 0; o < s; o++) {
                let n = getTitle(a, o), i = getContent(a, o), imgR = getFirstImage(i, o), r = typeof imgR == "undefined" ? "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi0-7xKbUSegSwFTeDbqAE-8XrnEfpTxU5Q5ETrPGPfTdOioJS1dF0Dax7zp-epg2CXxpmDArFctNMc1nzc_Nvww753xtlBP6aVrEHTlXPpl1R9-NRHkf_athvY-9HABrrx-ZFZa04SqZJMnKN5ET4o8XJi29aPxOjQjNNxUHfG9tLHedWZzLXgTy__/s320/image_not_found.jpeg" : imgR, pdate = getPostDate(a, o), author = getAuthor(a, o), l = getPostLink(a, o), clsI = o == 0 ? 'col-12 item-thumbnail' : 'col-4 item-thumbnail', clsC = o == 0 ? 'col-12 post-body' : 'col-8 post-body';
                if (o == 0) { e = e + '<div class="' + vb_class + '"><article class="post-item post-' + o + ' h-100"><div class="mb-3 h-100"> <div class="row h-100 g-0"><div class="' + clsI + '"><img alt="' + n + '" class="card-img-top" src="' + r + '"/></div> <div class="' + clsC + '"><div class="post-body"><h3 class="post-title entry-title"><a href="' + l + '">' + n + '</a></h3><div class="post-meta d-flex justify-content-between"><span class="byline post-timestamp fs-10"><i class="bi bi-clock"></i><a class="timestamp-link" href="https://smakblog-themescoder.blogspot.com/2022/10/improving-decision-making-skills-with.html" rel="bookmark" title="permanent link"><time class="published" datetime="2022-10-22T09:19:00-07:00" title="2022-10-22T09:19:00-07:00">' + pdate + '</time></a></span> ' + author + '</div> </div></div></div></div></article></div><div class="' + vb_class + ' row"> '; } else { e = e + '<article class="post-item post-' + o + '"><div class="mb-3 h-100"> <div class="row h-100 g-0"><div class="' + clsI + '"><img alt="' + n + '" class="card-img-top" src="' + r + '"/></div> <div class="' + clsC + '"><div class="post-body"><h3 class="post-title entry-title"><a href="' + l + '">' + n + '</a></h3><div class="post-meta d-flex justify-content-between"><span class="byline post-timestamp fs-10"><i class="bi bi-clock"></i><a class="timestamp-link" href="https://smakblog-themescoder.blogspot.com/2022/10/improving-decision-making-skills-with.html" rel="bookmark" title="permanent link"><time class="published" datetime="2022-10-22T09:19:00-07:00" title="2022-10-22T09:19:00-07:00">' + pdate + '</time></a></span> ' + author + '</div> </div></div></div></div></article>'; }
            } let finalC = nav + '<div class="posts row">' + e + '</div></div>'; parentE.html(finalC); $("img.lazyload").lazyload(); navW();
        },
        error: function (t) { parentE.append('<div class="text-danger">Something is wrong!</div>'); },
        complete: function () { },
        dataType: "json",
    });
}  // End ajaxJsonD


function getTitle(t, i) { return t[i].title.$t }
function getContent(t, i) { return t[i].content.$t.toString() }
function getFirstImage(t, i) { return $("<div>" + t + "</div>").find("img:first").attr("src") }
function getPostLink(t, i) { return t[i].link[4].href }
function getPostSummary(t, i) { let a = "<div>" + t + "</div>"; return a ? '<span class="entry-excerpt excerpt">' + $(a).text().trim().substr(0, 250) + "</span>" : "" }
function getLabel(t, i) { let a = "", s = t[i].category; for (let o = 0; o < s.length; o++)(0 == o || 1 == o) && (a = a + '<a class="label" href="#">' + s[o].term + "</a>"); return a }
function getSingleLabel(t, i) { let a = "", s = t[i].category; for (let o = 0; o < s.length; o++)0 == o && (a = a + '<a class="label" href="#">' + s[o].term + "</a>"); return a }
function getCommentCount(t, i) { return t[i].link[1].title.trim().split("")[0] }
function getPostDate(t, i) { let a = "", s = 0, o = "", n = t[i].published.$t.split("T")[0].split("-"); switch (a = n[0], mm = parseInt(n[1]), o = n[2], mm) { case 1: s = "Jan"; break; case 2: s = "Feb"; break; case 3: s = "Mar"; break; case 4: s = "Apr"; break; case 5: s = "May"; break; case 6: s = "Jun"; break; case 7: s = "Jul"; break; case 8: s = "Aug"; break; case 9: s = "Sep"; break; case 10: s = "Oct"; break; case 11: s = "Nov"; break; case 12: s = "Dec" }return s + " " + o + ", " + a }

function getAuthor(t, i) { let auth = '<span class="byline post-author vcard fs-10"><span class="post-author-label"><i class="bi bi-person-circle"></i></span><span class="fn"><meta content="' + t[i].author[0].uri.$t + '"/><a class="g-profile author-name" href="' + t[i].author[0].uri.$t + '" rel="author" title="author profile"><span>' + t[i].author[0].name.$t + '</span></a></span></span>'; return auth; }


/*
   ===== Theme Dark and light mood Control Function =====
*/
function theme_mood() {
    let t = localStorage.getItem("theme"); if (void 0 === t) localStorage.setItem("theme", "light"), $("body").addClass("light-theme"); else { var e = $(".dark-icon"); "dark" == t ? LightMood(e) : DarkMoof(e) } //End Theme Mod Function

    $(".dark-icon").each(function (t, e) { $(this).on("click", function (t) { let e = localStorage.getItem("theme"); ($(this).data("mood"), "light" == e) ? LightMood($(this)) : DarkMoof($(this)) }) })
}//End dark-icon Click

function DarkMoof(t) { t.html('<i class="bi bi-moon"></i>'), t.data("mood", "light"), localStorage.setItem("theme", "light"), $("body").addClass("light-theme").removeClass("dark-theme") } //End DarkMoof fn
function LightMood(t) { t.html('<i class="bi bi-brightness-high"></i>'), t.data("mood", "dark"), localStorage.setItem("theme", "dark"), $("body").addClass("dark-theme").removeClass("light-theme") } //End light fn





