function Zoomin() {
    document.getElementById('maps').height = (parseInt(document.getElementById('maps').height.substring(0,document.getElementById('maps').height.length - 2)) + 200 ) + 'px';
    document.getElementById('maps').width = (parseInt(document.getElementById('maps').width.substring(0,document.getElementById('maps').width.length - 2)) + 175 ) + 'px';
}
function Zoomout() {
      document.getElementById('maps').height = (parseInt(document.getElementById('maps').height.substring(0,document.getElementById('maps').height.length - 2)) - 200 ) + 'px';
      document.getElementById('maps').width = (parseInt(document.getElementById('maps').width.substring(0,document.getElementById('maps').width.length - 2)) - 175 ) + 'px';
}

function AmountMap() {
    initlegend(0, 200000);
    document.getElementById('tabletitle').innerHTML = "Regional Donation Amount Distribution"; 
    init(function (data, title) {return amount(data, title);}, 0, 200000);
  
}
function DonorMap() {
    initlegend(0, 2000);
    document.getElementById('tabletitle').innerHTML = "Regional Number of Donors Distribution"; 
    init(function (data, title) {
        return count(data, title);
    }, 0, 2000);
}

function AmountDonorMap() {
    initlegend(0, 20000);
    document.getElementById('tabletitle').innerHTML = "Regional Average Donation Distribution"; 
    init(function (data, title) {
        return avg_amount(data, title);
    }, 0, 20000);
}

function findData(data, title) {
    for (var i in data) {
        if (data[i].district.toLowerCase() === title.toLowerCase()) {
            return data[i];
        }
    }
    return null;
}

function count(data, title) {
    var d = findData(data, title);
    return d == null ? "0" : d.num_donors;
}

function amount(data, title) {
    var d = findData(data, title);
    return d == null ? "0" : d.total_amount;
}

function avg_amount(data, title) {
    var d = findData(data, title);
    return d == null ? "0" : d.avg_amount;
}

var str;
function initlegend(min, max) {
  str = "<table width='100%' border='1'><tr align='center'><td width='20%' bgcolor='#000000' style='color:white'>NIL</td><td width='20%' bgcolor='#ff0000'>";
  str = str + min + " - " + max/100 +"</td><td width='20%' bgcolor='#0000ff'>";
  str = str + max/100 + " - " + max/10 +"</td><td width='20%' bgcolor='#00ff00'>";
  str = str + max/10 + " - " + max/2 +"</td><td width='20%' bgcolor='#ffffff'>";
  str = str + max/2 + " - " + max +"</td></tr></table>";
  document.getElementById('legend').innerHTML = str; 
}


function init(colorDecider, min, max) {
    var color = d3.scale.linear().range(["rgb(0,0,0)","rgb(255,0,0)","rgb(0,0,255)","rgb(0,255,0)","rgb(255,255,255)"]);
    d3.csv("materialized_district_level_view.csv", function (data) {
        var svg = d3.select(document.getElementsByTagName("iframe")[0].contentWindow.document);
        color.domain([min,1 , max/100, max/10 ,max/2 ,max]);
	function colorFor(title) {
            return color(colorDecider.call(this, data, title));
        }
        
        var title;

        svg.selectAll('path')
            .style('stroke', 'black')
            .style('stroke-width', .5)
	    .style('fill',function () {
                var title = this.getAttribute('title');
                return colorFor(title);
            }).on("mouseover",function () {
                var district = d3.select(this);
                district.style('fill', d3.rgb(district.style('fill')).darker());
                title = this.getAttribute('title');
		d3.select('#district')
                    .text(title);
                d3.select('#state')
                    .text(district[0][0].parentElement.getAttribute('title'));
                d3.select('#donors')
                    .text(count(data, title));
                d3.select('#amount')
                    .text(amount(data, title).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                d3.select('#avg_amount')
                    .text(avg_amount(data, title));
		this.setAttribute('data-toggle',"tooltip")
		this.setAttribute('data-placement',"right") 
		this.setAttribute('title',title + ", " + district[0][0].parentElement.getAttribute('title') + "\n Donors: " + count(data, title) + "\n Amount: " + amount(data, title).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "\n Average: " + avg_amount(data, title));
		
            }).on("mouseout", function () {
		this.setAttribute('title',title);
                var district = d3.select(this);
                district.style('fill', colorFor(this.getAttribute('title')));
                d3.select('#district').text('.');
                d3.select('#state').text('.');
                d3.select('#donors').text('.');
                d3.select('#amount').text('.');
                d3.select('#avg_amount').text('.');
            }).on("click",function () {
                var district = d3.select(this);
                district.style('fill', d3.rgb(district.style('fill')).darker());
               d3.select('#district1')
                    .text(title);
                d3.select('#state1')
                    .text(district[0][0].parentElement.getAttribute('title'));
                d3.select('#donors1')
                    .text(count(data, title));
                d3.select('#amount1')
                    .text(amount(data, title).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                d3.select('#avg_amount1')
                    .text(avg_amount(data, title));
            });
    });
}
