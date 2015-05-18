function DepthFirstSearch (startNode, endNode, depth, iterative) {
	this.startNode = startNode;
    if(depth !== undefined) this.startNode.depth = 0;
	this.endNode = endNode;
    this.maxDepth = depth;
    this.maxDepthTooSmall = [];
	this.openedNodes = [];
	this.visited = [startNode];
	this.pathDoesntExist = false;
	
    if((depth !== undefined && depth == 0) || iterative !== undefined) {//iterative means we are using this search as a helper in iterative depth first
        this.nextStep = startNode;
        this.maxDepthTooSmall.push(new Node(0, 0, 0));//dummy node, it is added so function isDepthTooSmall would return true
        return;
    }

    var nodes = this.startNode.expand();
    for (var i = nodes.length - 1; i >= 0; i--) {
        nodes[i].cameFrom = this.startNode;
    }

    if(depth !== undefined) {
        this.expand(nodes, this.startNode.depth + 1);
    } else {
        this.expand(nodes);
    }

	if(this.openedNodes.length == 0) {
		this.pathDoesntExist = true;
	} else {
		this.nextStep = this.openedNodes.pop();
	}
}

DepthFirstSearch.prototype = {
	
	constructor: DepthFirstSearch,

	isNextStep: function (node) {
		if(this.nextStep == endNode && node == endNode) {
			return this.reconstructPath(node);
		}

		if(this.nextStep != node) {
			return false;
		}

		this.visited.push(node);

        if(this.maxDepth === undefined || node.depth < this.maxDepth) {
            var nodes = node.expand();
            for (var i = nodes.length - 1; i >= 0; i--) {
                if(this.visited.indexOf(nodes[i]) == -1) {
                    nodes[i].cameFrom = node;
                }
            }

            if(this.maxDepth !== undefined) {
	           this.expand(nodes, node.depth + 1);
            } else {
                this.expand(nodes);
            }
        } else {
            var nodes = node.expand();
            for (var i = nodes.length - 1; i >= 0; i--) {
                if(this.visited.indexOf(nodes[i]) == -1) {
                    this.maxDepthTooSmall.push(nodes[i]);
                }
            }
        }
		
        if(this.openedNodes.length == 0) {
			this.pathDoesntExist = true;
		} else {
			this.nextStep = this.getNext();
			if(this.nextStep == null) {
                this.pathDoesntExist = true;
            }
		}
        
		return true;
	},

	expand: function (nodes, depth) {
		nodes.sort(function (a, b) {
			if(a.id < b.id) {
				return -1;
			} else if(a.id > b.id) {
				return 1;
			} else {
				return 0;
			}
		});

		for (var i = nodes.length - 1; i >= 0; i--) {
			if(this.visited.indexOf(nodes[i]) == -1) {
                if(depth !== undefined) nodes[i].depth = depth;
				this.openedNodes.push(nodes[i]); 
			}
		}
	},

	getNext: function () {
		var node;
		while(this.openedNodes.length > 0) {
			node = this.openedNodes.pop();
			if(this.visited.indexOf(node) == -1) {
				return node;
			}
		}
		return null;
	},

    findLink: function(aNode) {
        var prevNode;
        var tempnode;
        for (var i = aNode.links.length - 1; i >= 0; i--) {
            tempnode = aNode.links[i].node;
            if (  (this.visited.indexOf(tempnode) != -1) && (tempnode.value + aNode.links[i].value == aNode.value)) {
                prevNode = tempnode;
            }
        }
        for (var i = aNode.links.length - 1; i >= 0; i--) {
            if(aNode.links[i].node === prevNode){
                return aNode.links[i];
            }
        }
    },

    reconstructPath: function (node) {
        var path = [node];
        var tmp;
        while((tmp = node.cameFrom) != null) {
            path.splice(0, 0, tmp);
            node = tmp;
        }

        return path;
    },

    isDepthTooSmall: function () {
        for (var i = this.maxDepthTooSmall.length - 1; i >= 0; i--) {
            if(this.visited.indexOf(this.maxDepthTooSmall[i]) == -1) {
                return true;
            }
        }
        return false;
    }
}

// -------------------------------------------
//                   MAIN
// -------------------------------------------


// VARIABLES
var startNode = null;
var endNode = null;
var d3startNode = null;
var d3endNode = null;
var nodes = [];
var search = null;

graphType = GraphType.depth_first;

var docEl = document.documentElement,
    bodyEl = document.getElementsByTagName('body')[0];

var width = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth,
    height = window.innerHeight || docEl.clientHeight || bodyEl.clientHeight;

var xLoc = width / 2 - 25,
    yLoc = 100;

// MAIN SVG
var svg = d3.select(settings.appendElSpec).append("svg")
    .attr("width", width)
    .attr("height", height);

var graph = new GraphCreator(svg, [], []);
graph.setIdCt(2);
graph.updateGraph();

// LISTENERS
document.getElementById("selectstart").addEventListener("click", function() {
    GraphCreator.prototype.circleMouseUp = function(d3node, d) {
        console.log(d3node.node());
        startNode = getNode(d.id);
        console.log(startNode);
        if (d3startNode != null) {
            d3startNode[0][0].setAttribute("stroke", "black");
        }
        d3node[0][0].setAttribute("stroke", "green");
        d3node.select("circle")[0][0].style.fill = "GreenYellow ";
        d3startNode = d3node;
        document.getElementById("selectend").removeAttribute("disabled");
    }

    GraphCreator.prototype.svgKeyDown = function() {

    }
    GraphCreator.prototype.svgMouseUp = function() {

    }
    GraphCreator.prototype.circleMouseDown = function() {

    }
    GraphCreator.prototype.dragmove = function(d) {

    }
    GraphCreator.prototype.pathMouseDown = function() {

    }
});

document.getElementById("selectend").addEventListener("click", function() {
    GraphCreator.prototype.circleMouseUp = function(d3node, d) {
        endNode = getNode(d.id);
        if (d3endNode != null) {
            d3endNode[0][0].setAttribute("stroke", "black");
        }
        d3node[0][0].setAttribute("stroke", "red");
        d3endNode = d3node;
        document.getElementById("startgame").removeAttribute("disabled");
    }
});

document.getElementById("startgame").addEventListener("click", function() {
    GraphCreator.prototype.circleMouseUp = function(d3node, d) {
        clickedNode = getNode(d.id);
        var edg;
        var l;
        var e;
        var result = search.isNextStep(clickedNode);

        if (result instanceof Array) {
           /* l = dijkstra.findLink(clickedNode);
            for (var i = graph.edges.length - 1; i >= 0; i--) {
                e = graph.edges[i];
                if( (e.source.id == l.node.id && e.target.id == clickedNode.id) || (e.target.id == l.node.id && e.source.id == clickedNode.id)){
                    edg = graph.edges[i];
                    break;
                }
            }
            document.getElementById(edg.id).style.stroke = "green"; 
            d3node.select("circle")[0][0].style.fill = "GreenYellow ";
            window.alert("dobro je, ne pritsci vise nista!");*/
            console.log(result);
        } else if (result) {
            l = search.findLink(clickedNode);
            for (var i = graph.edges.length - 1; i >= 0; i--) {
                e = graph.edges[i];
                if( (e.source.id == l.node.id && e.target.id == clickedNode.id) || (e.target.id == l.node.id && e.source.id == clickedNode.id)){
                    edg = graph.edges[i];
                    break;
                }

            }
            document.getElementById(edg.id).style.stroke = "green"; 
            d3node.select("circle")[0][0].style.fill = "GreenYellow ";
            if(search.pathDoesntExist) {
                if(search.isDepthTooSmall()) {
                    window.alert("depth premali");
                } else {
                    window.alert("ne postoji put");
                }
            }
        } else {
            console.log(result);
            wrongAnimation(d3node.select("circle"));
        }
    }

    document.getElementById("selectstart").setAttribute("disabled", "");
    document.getElementById("selectend").setAttribute("disabled", "");

    search = new DepthFirstSearch(startNode, endNode, 3);
});

document.getElementById("enddrawing").addEventListener("click", function() {

    var n;
    for (var i = graph.nodes.length - 1; i >= 0; i--) {
        n = graph.nodes[i];
        nodes.push(new Node(n.x, n.y, n.id));
    }

    var source, target, e;
    for (var i = graph.edges.length - 1; i >= 0; i--) {
        e = graph.edges[i];
        source = getNode(e.source.id);
        target = getNode(e.target.id);
        source.addLink(new Link(target, e.weight));
        target.addLink(new Link(source, e.weight));
    }

    document.getElementById("enddrawing").setAttribute("disabled", "");
    document.getElementById("selectstart").removeAttribute("disabled");

});

document.getElementById("graph1").addEventListener("click",
    function() {
		createGraph({"nodes":[{"id":3,"title":"A","x":430,"y":86},{"id":4,"title":"B","x":209,"y":244},{"id":5,"title":"C","x":434,"y":246},{"id":6,"title":"D","x":648,"y":243},{"id":7,"title":"E","x":89,"y":402},{"id":8,"title":"F","x":287,"y":407}],"edges":[{"source":3,"target":5,"id":"pathId0","weight":""},{"source":3,"target":4,"id":"pathId1","weight":""},{"source":3,"target":6,"id":"pathId2","weight":""},{"source":4,"target":8,"id":"pathId3","weight":""},{"source":4,"target":7,"id":"pathId4","weight":""}]});
    });

document.getElementById("graph2").addEventListener("click",
	function(){
		createGraph({"nodes":[{"id":3,"title":"A","x":730,"y":362},{"id":4,"title":"B","x":461,"y":77},{"id":5,"title":"C","x":371,"y":517},{"id":6,"title":"D","x":461,"y":302},{"id":7,"title":"E","x":144,"y":369},{"id":10,"title":"H","x":706,"y":517},{"id":11,"title":"I","x":199,"y":512},{"id":12,"title":"J","x":278,"y":173},{"id":13,"title":"K","x":634,"y":171},{"id":14,"title":"L","x":532,"y":520}],"edges":[{"source":6,"target":4,"id":"pathId0","weight":1},{"source":6,"target":10,"id":"pathId1","weight":1},{"source":6,"target":11,"id":"pathId2","weight":1},{"source":11,"target":7,"id":"pathId3","weight":1},{"source":11,"target":5,"id":"pathId4","weight":1},{"source":3,"target":10,"id":"pathId5","weight":1},{"source":4,"target":13,"id":"pathId11","weight":1},{"source":4,"target":12,"id":"pathId12","weight":1},{"source":14,"target":10,"id":"pathId13","weight":1}]});
	});
	
document.getElementById("garph3").addEventListener("clicke",
	function(){
		createGraph({"nodes":[{"id":3,"title":"A","x":98,"y":102},{"id":4,"title":"B","x":535,"y":306},{"id":5,"title":"C","x":311,"y":304},{"id":6,"title":"D","x":316,"y":103},{"id":7,"title":"E","x":647,"y":210},{"id":8,"title":"F","x":102,"y":304},{"id":9,"title":"G","x":533,"y":466},{"id":10,"title":"H","x":534,"y":101}],"edges":[{"source":3,"target":6,"id":"pathId0","weight":""},{"source":5,"target":10,"id":"pathId2","weight":""},{"source":6,"target":4,"id":"pathId4","weight":""},{"source":5,"target":9,"id":"pathId5","weight":""},{"source":10,"target":7,"id":"pathId6","weight":""},{"source":4,"target":7,"id":"pathId7","weight":""},{"source":3,"target":8,"id":"pathId8","weight":""},{"source":8,"target":5,"id":"pathId9","weight":""}]});
	});
// FUNCTIONS
function createGraph(json){
	if(!this.graph.nodes === []){
		return;
	}
    GraphCreator.prototype.svgKeyDown = function() {};
    GraphCreator.prototype.svgMouseUp = function() {};
    GraphCreator.prototype.circleMouseDown = function() {};
    GraphCreator.prototype.dragmove = function(d) {};
    GraphCreator.prototype.pathMouseDown = function() {};
	var starterGraph = json;
        graph.deleteGraph(true);
		var jsonObj = starterGraph;
        graph.nodes = jsonObj.nodes;
        graph.setIdCt(jsonObj.nodes.length + 1);
        var newEdges = jsonObj.edges;
        newEdges.forEach(function(e, i) {
        newEdges[i] = {
            source: graph.nodes.filter(function(n) {
                return n.id == e.source;
                })[0],
                target: graph.nodes.filter(function(n) {
                return n.id == e.target;
                })[0],
                id: e.id,
                weight: e.weight
                };
         });
         graph.edges = newEdges;
         graph.updateGraph()
}

function getNode(id) {
    for (var i = nodes.length - 1; i >= 0; i--) {
        if (nodes[i].id == id) {
            return nodes[i];
        }
    }
    return null;
}

function wrongAnimation(node){
    node
    .transition()
    .style("fill","red")
    .duration(125)
    .transition()
    .style("fill","#F6FBFF")
    .duration(125)
    .transition()
    .style("fill","red")
    .duration(125)
    .transition()
    .style("fill","#F6FBFF")
    .duration(125);
}