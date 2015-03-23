var _ = require("underscore");

var renderers = require("../../src/js/renderers");
var sorting = require("../../src/js/sorting");

var genomic_oncoprint = require('../../src/js/genomic');

var config = { rect_height: 20,
              rect_padding: 3,
              rect_width: 10,
              row_height: 25,
              mutation_fill: 'green',
              width: 750,
              cna_fills: {
              null: 'grey',
              undefined: 'grey',
              AMPLIFIED: 'red',
              HOMODELETED: 'blue'
             }
};

// TODO this is dirty.
window.test_for_genomic_data = function(filename, div_selector_string) {
  return d3.json(filename, function(data) {

    // break into rows
    rows = _.chain(data).groupBy(function(d) { return d.gene; }).values().value();
    sorted_rows = sorting.sort_rows(rows, sorting.genomic_metric);
    d3.select(div_selector_string).datum(sorted_rows);

    var oncoprint = genomic_oncoprint();

    oncoprint.config(config);

    var rendering_rules = _.map(rows, function(row) {
      // at the cBioPortal OncoPrints always start as just genomic data.
      return renderers.gene_rule;
    });
    oncoprint.rendering_rules(rendering_rules);

    d3.select(div_selector_string).call(oncoprint);

    d3.json("gender.json", function(payload) {
      var gender_data = payload.data;
      oncoprint.insert_row(d3.select(div_selector_string), gender_data, renderers.gender_rule);
    });

  });
};
