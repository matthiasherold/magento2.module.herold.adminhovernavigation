/**
 * Copyright © 2016 Matthias Herold
 * See LICENSE.md bundled with this module for license details.
 */

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'jquery',
            'jquery/ui',
            'globalNavigation'
        ], factory);
    } else {
        factory(jQuery);
    }
}(function ($) {
    'use strict';

    $.widget('mage.globalNavigation', {
        options: {
            selectors: {
                menu: '#nav',
                currentItem: '._current',
                topLevelItem: '.level-0',
                topLevelHref: '> a',
                subMenu: '> .submenu',
                closeSubmenuBtn: '[data-role="close-submenu"]'
            },
            overlayTmpl: '<div class="admin__menu-overlay"></div>'
        },

        _create: function () {
            var selectors = this.options.selectors;

            this.menu = this.element;
            this.menuLinks = $(selectors.topLevelHref, selectors.topLevelItem);
            this.closeActions = $(selectors.closeSubmenuBtn);

            this._initOverlay()
                ._bind();
        },

        _initOverlay: function () {
            this.overlay = $(this.options.overlayTmpl).appendTo('body').hide(0);

            return this;
        },

        _bind: function () {
            var focus = this._focus.bind(this),
                open = this._open.bind(this),
                blur = this._blur.bind(this),
                keyboard = this._keyboard.bind(this),
                openHover = this._openHover.bind(this);

            this.menuLinks
                .on('focus', focus)
                .on('click', open)
                .on('mouseenter', openHover);

            this.menuLinks.last().on('blur', blur);

            this.closeActions.on('keydown', keyboard);
        },


        /**
         * Remove active class from current menu item
         * Turn back active class to current page menu item
         */
        _blur: function (e) {
            var selectors = this.options.selectors,
                menuItem = $(e.target).closest(selectors.topLevelItem),
                currentItem = $(selectors.menu).find(selectors.currentItem);

            menuItem.removeClass('_active');
            currentItem.addClass('_active');
        },

        /**
         * Add focus to active menu item
         */
        _keyboard: function (e) {
            var selectors = this.options.selectors,
                menuItem = $(e.target).closest(selectors.topLevelItem);

            if (e.which === 13) {
                this._close(e);
                $(selectors.topLevelHref, menuItem).focus();
            }
        },

        /**
         * Toggle active state on focus
         */
        _focus: function (e) {
            var selectors = this.options.selectors,
                menuItem = $(e.target).closest(selectors.topLevelItem);

            menuItem.addClass('_active')
                .siblings(selectors.topLevelItem)
                .removeClass('_active');
        },

        _closeSubmenu: function (e) {
            var selectors = this.options.selectors,
                currentItem = $(selectors.menu).find(selectors.currentItem);

            this._close(e);

            currentItem.addClass('_active');
        },

        _open: function (e) {
            var selectors = this.options.selectors,
                menuItemSelector = selectors.topLevelItem,
                menuItem = $(e.target).closest(menuItemSelector),
                subMenu = $(selectors.subMenu, menuItem),
                close = this._closeSubmenu.bind(this),
                closeBtn = subMenu.find(selectors.closeSubmenuBtn);


            if (subMenu.length) {
                e.preventDefault();
            }

            menuItem.addClass('_show')
                .siblings(menuItemSelector)
                .removeClass('_show');

            subMenu.attr('aria-expanded', 'true');

            //subMenu.css('height', subMenu.find('ul.menu')[0].height() + subMenu.find('strong.submenu-title').height());

            closeBtn.on('click', close);

            this.overlay.show(0).on('click', close);
            this.menuLinks.last().off('blur');
        },

        _close: function (e) {
            var selectors = this.options.selectors,
                menuItem = this.menu.find(selectors.topLevelItem + '._show'),
                subMenu = $(selectors.subMenu, menuItem),
                closeBtn = subMenu.find(selectors.closeSubmenuBtn),
                blur = this._blur.bind(this);

            e.preventDefault();

            this.overlay.hide(0).off('click');

            this.menuLinks.last().on('blur', blur);

            if (subMenu.length) {
                subMenu.off('mouseleave');
            }

            closeBtn.off('click');

            subMenu.attr('aria-expanded', 'false');

            menuItem.removeClass('_show _active');
        },

        _openHover: function (e) {
            var selectors = this.options.selectors,
                menuItemSelector = selectors.topLevelItem,
                menuItem = $(e.target).closest(menuItemSelector),
                subMenu = $(selectors.subMenu, menuItem),
                close = this._closeSubmenu.bind(this),
                closeBtn = subMenu.find(selectors.closeSubmenuBtn);


            if (subMenu.length) {
                e.preventDefault();

                subMenu.on('mouseleave', close);
            }

            menuItem.addClass('_show')
                .siblings(menuItemSelector)
                .removeClass('_show');

            subMenu.attr('aria-expanded', 'true');

            //subMenu.css('height', subMenu.find('ul.menu')[0].height() + subMenu.find('strong.submenu-title').height());

            closeBtn.on('click', close);

            this.overlay.show(0).on('click', close);
            this.menuLinks.last().off('blur');
        }

    });

    return $.mage.globalNavigation;
}));