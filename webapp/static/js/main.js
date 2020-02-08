
//variables to hold the data
var dataRegions = [];  
var dataConstituencies = [];
var dataNatlElecResultsByConst = [];  
var dataBrexitResultsByConst = [];
var dataNatlElecResultsByRegion = [];  
var dataBrexitResultsByRegion = [];

var brexitElecReport = {
	reportId: 1,
	reportElemID: "#election_1",
	reportName: "2016 Brexit",
	reportSubtitle: "National",
	reportData: []
};

var natlElecReport = {
	reportId: 2,
	reportElemID: "#election_2",
	reportName: "2019 UK Election",
	reportSubtitle: "National",
	reportData: []
};

//Initialize data and call for rendering of reports 
function initDashboard(){	
	//Get UK Regions 
	d3.csv("./static/data/ukregions.csv").then(function(data){
		dataRegions = data;
		
		//Get UK Constituencies
		d3.csv("./static/data/ukconstituencies.csv").then(function(data){
			dataConstituencies = data;
						
			//Get UK National Election Results By Const
			d3.csv("./static/data/ukelectionresults_byconst.csv").then(function(data){
				dataNatlElecResultsByConst = data;				
				
				//Get UK Brexit Results By Const
				d3.csv("./static/data/ukbrexitresults_byconst.csv").then(function(data){
					dataBrexitResultsByConst = data;
					
					//Get UK National Results By Region
					d3.csv("./static/data/ukelectionresults_byregion.csv").then(function(data){
						dataNatlElecResultsByRegion = data;
						
						//Get UK Brexit Results By Region
						d3.csv("./static/data/ukbrexitresults_byregion.csv").then(function(data){
							
							console.log("Initialize Report");
							dataBrexitResultsByRegion = data;							

							//By Default 
							brexitElecReport.reportData = dataBrexitResultsByRegion;
							natlElecReport.reportData = dataNatlElecResultsByRegion ;
						
							//Initialize Report
							renderReport(brexitElecReport);
							renderReport(natlElecReport);
							renderComparison(brexitElecReport,natlElecReport);

						}).catch(function(error) {
							console.log(error); 
						});

					}).catch(function(error) {
						console.log(error); 
					});

				}).catch(function(error) {
					console.log(error); 
				});				
			}).catch(function(error) {
				console.log(error); 
			});
		}).catch(function(error) {
			console.log(error); 
		});
	}).catch(function(error) {
		console.log(error); 
	});
}

//Render the report by election
function renderReport(objReportData){
	renderRptHeader(objReportData);
	renderSummary(objReportData);
	renderMap(objReportData);
	renderDetails(objReportData);
	//renderComparison(objReportData);
}

//Set report title/subtitles
function renderRptHeader(objReportData){
	console.log("Report Header");	
	d3.select(objReportData.reportElemID).select(".elname").text(objReportData.reportName);
	d3.select(objReportData.reportElemID).select(".elsubtitle").text(objReportData.reportSubtitle);
}

