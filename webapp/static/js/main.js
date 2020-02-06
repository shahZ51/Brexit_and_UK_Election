
//variables to hold the data
var dataRegions = [];  
var dataConstituencies = [];
var dataNatlElecResults = [];  
var dataBrexitResults = [];

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
		console.log(dataRegions);		

		//Get UK Constituencies
		d3.csv("./static/data/ukconstituencies.csv").then(function(data){
			dataConstituencies = data;
			console.log(dataConstituencies);
			
			//Get UK National Election Results
			d3.csv("./static/data/ukelectionresults.csv").then(function(data){
				dataNatlElecResults = data;
				console.log(dataNatlElecResults);	
				
				//Get UK Brexit Results
				d3.csv("./static/data/ukbrexitresults.csv").then(function(data){
					dataBrexitResults = data;
					console.log(dataBrexitResults);		

					brexitElecReport.reportData = dataBrexitResults;
					natlElecReport.reportData = dataNatlElecResults;
				
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
}

//Render the report by election
function renderReport(objReport){
	renderRptHeader(objReport.reportElemID, objReport.reportName, objReport.reportSubtitle);
	renderSummary(objReport.reportElemID, objReport.reportData);
	renderMap(objReport.reportElemID, objReport.reportData);
	renderDetails(objReport.reportElemID, objReport.reportData);
}

//Set report title/subtitles
function renderRptHeader(reportElemID, reportTitle, reportSubTitle){
	d3.select(reportElemID).select(".elname").text(reportTitle);
	d3.select(reportElemID).select(".elsubtitle").text(reportSubTitle);
}

