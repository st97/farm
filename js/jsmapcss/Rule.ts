// ----------------------------------------------------------------------
// Rule class

import styleparser from "./Style";

styleparser.Rule = function () {};
styleparser.Rule.prototype = {
  conditions: [], // the Conditions to be evaluated for the Rule to be fulfilled
  isAnd: true, // do all Conditions need to be true for the Rule to be fulfilled? (Always =true for MapCSS)
  minZoom: 0, // minimum zoom level at which the Rule is fulfilled
  maxZoom: 255, // maximum zoom level at which the Rule is fulfilled
  subject: "", // entity type to which the Rule applies: 'way', 'node', 'relation', 'area' (closed way), 'line' (unclosed way), or '*' (everything)

  addSubject(_subject) {
    // summary:		A MapCSS selector. Contains a list of Conditions; the entity type to which the selector applies;
    //				and the zoom levels at which it is true. way[waterway=river][boat=yes] would be parsed into one Rule.
    //				The selectors and declaration together form a StyleChooser.
    this.subject = _subject;
    this.conditions = [];
  },

  addCondition(_condition) {
    // summary:		Add a condition to this rule.
    this.conditions.push(_condition);
  },

  test(entity, tags, zoom) {
    // summary: Evaluate the Rule on the given entity, tags and zoom level.
    // returns: true if the Rule passes, false if the conditions aren't fulfilled.
    if (this.subject !== "" && !entity.isSubject(this.subject)) {
      return false;
    }
    if (zoom < this.minZoom || zoom > this.maxZoom) {
      return false;
    }

    let v = true;
    let i = 0;
    var isAnd = this.isAnd;
    this.conditions.forEach((condition) => {
      var r = condition.test(tags);
      if (i === 0) {
        v = r;
      } else if (isAnd) {
        v = v && r;
      } else {
        v = v || r;
      }
      i++;
    });
    return v;
  },

  toString() {
    return `${this.subject} z${this.minZoom}-${this.maxZoom}: ${this.conditions}`;
  }
};
