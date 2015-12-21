module moddynBlog {
  'use strict';

  export class d3HelperService {

    /** @ngInject */
    constructor(private $http: any, private $rootScope: any) {
      var that = this;
      $(window).resize(function() {

        if (this.innerWidth < 992) {
          $rootScope.$emit('window_resize_to_mobile', this.innerWidth);
        } else {
          $rootScope.$emit('window_resize_to_desktop', this.innerWidth);
        }
      });
    }

    public removeSVGOnDestroy(svg: any, d3: any) {
      svg.selectAll("*").remove();
      d3.select("svg").remove();
    }

    public createSVG(d3, width, height, margin, ele, cssClass) {
      height = height + margin.top + margin.bottom;
      width = width + margin.left + margin.right;
      var svg = d3.select(ele[0]).append("svg")
        .attr("height", height)
        .attr('width', '100%')
        .attr("class", cssClass)

      svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      return svg;
    }

    public createXAxis(d3, x, orientation) {
      var xAxis = d3.svg.axis()
        .scale(x)
        .orient(orientation);
      return xAxis;
    }

    public createYAxis(d3, y, orientation) {
      var yAxis = d3.svg.axis()
        .scale(y)
        .orient(orientation);
      return yAxis;
    }

    public createTitle(svg: any, width: number, margin: any, title: string) {
      svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 3))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text(title);
    }

    public getData(url) {
      return this.$http.get(url)
        .then((response: any) => {
          return response.data;
        })
        .catch((error: any) => {
          console.error('Failed to fetch posts', error);
        });
    }

  }
}
