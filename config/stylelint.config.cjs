// Source: https://github.com/stormwarning/stylelint-config-recess-order#advanced

const propertyGroups = require("stylelint-config-recess-order/groups");

// Note to self: if the property ordering or grouping
// doesn't work well with you, create your own ordering
// config.
module.exports = {
  extends: ["stylelint-config-standard", "stylelint-config-standard-scss"],
  // `stylelint-order` is needed for the
  // `"order/*"` rules which drive property
  // ordering.
  plugins: ["stylelint-order"],
  rules: {
    // 🦶(1)
    "declaration-empty-line-before": null,

    "order/properties-order": propertyGroups.map((group) => ({
      ...group,

      emptyLineBefore: "always",
      noEmptyLineBetween: true,
    })),

    "selector-class-pattern": null,
    "font-family-no-missing-generic-family-keyword": null,

    // SCSS rules
    "scss/no-global-function-names": null,
  },
};

// FOOT NOTES

/** 🦶(1)
 *
 *  Issue:
 *    It was recommended by `stylelint-config-recess-order` to not extend
 *    `stylelint-config-standard` (@see https://github.com/stormwarning/stylelint-config-recess-order#advanced).
 *    However, without that config, `stylelint` would not do any syntax
 *    checking, only the ordering of CSS properties. When I extended
 *    `stylelint-config-standard`, hoping to receive back that functionality,
 *    the ordering functionality from `stylelint-config-recess-order` stopped
 *    working.. or seemed to be overridden by something within the `stylelint-config-standard`.
 *
 *  Solution:
 *     It turns out that `stylelint-config-standard`'s use of the
 *     `"declaration-empty-line-before"` rule was overriding `stylelint-config-recess-order`'s
 *     `emptyLineBefore`/`noEmptyLineBetween` properties (I'm not sure whether it affected
 *      one, the other, or both, but I need both properties' functionalities to not be overridden).
 *
 */
