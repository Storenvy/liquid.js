Liquid.Variable = Class.extend({

  init: function(markup) {
    this.markup = markup;
    this.name = null;
    this.filters = [];
    var self = this;
    var match = markup.match(/\s*("[^"]+"|'[^']+'|[^\s,|]+)/);
    if( match ) {
      this.name = match[1];
      var filterMatches = markup.match(/\|\s*(.*)/);
      if(filterMatches) {
        var filters = filterMatches[1].split(/\|/);
        filters.forEach(function(f){
          var matches = f.match(/\s*(\w+)/);
          if(matches) {
            var filterName = matches[1];
            var filterArgs = [];
            (f.match(/(?:[:|,]\s*)("[^"]+"|'[^']+'|[^\s,|]+)/g) || []).flatten().forEach(function(arg){
              var cleanupMatch = arg.match(/^[\s|:|,]*(.*?)[\s]*$/);
              if (cleanupMatch) {
                filterArgs.push( cleanupMatch[1] );
              }
            });
            self.filters.push( [filterName, filterArgs] );
          }
        });
      }
    }
  },

  render: function(context) {
    if(this.name == null){ return ''; }
    var output = context.get(this.name);
    this.filters.forEach(function(filter) {
      var filterName = filter[0],
          filterArgs = (filter[1] || []).map(function(arg){
            return context.get(arg);
          });
      filterArgs.unshift(output); // Push in input value into the first argument spot...
      output = context.invoke(filterName, filterArgs);
    });

    // return (typeof output !== 'object' || typeof output.splice === 'function' ) ? output : '';
    return (output != null) ? output : '';
  }
});
