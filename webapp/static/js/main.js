
//variables to hold the data
var dataRegions = [];  
var dataConstituencies = [];
var dataNatlElecResultsByConst = [];  
var dataBrexitResultsByConst = [];
var dataNatlElecResultsByRegion = [];  
var dataBrexitResultsByRegion = [];
var dataParties = [];

var brexitElecReport = {
	reportId: 1,
	reportElemID: "#election_1",
	reportName: "2016 Brexit",	
	reportDataRegional: [], 
	reportDataConst:[]
};

var natlElecReport = {
	reportId: 2,  
	reportElemID: "#election_2",
	reportName: "2019 UK Election",
	reportSubtitle: "National",
	reportDataRegional: [], 
	reportDataConst:[]
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

							d3.csv("./static/data/ukparties.csv").then(function(data){

								dataParties = data;
								//By Default 
								brexitElecReport.reportDataRegional = dataBrexitResultsByRegion;
								brexitElecReport.reportDataConst = dataBrexitResultsByConst;

								natlElecReport.reportDataRegional = dataNatlElecResultsByRegion ;
								natlElecReport.reportDataConst = dataNatlElecResultsByConst;
								

								let overallNalElecResults = filterElection(3, natlElecReport, dataRegions, dataConstituencies, dataParties );

								console.log("National Election Stats");
								console.log(overallNalElecResults);

								let overallBrexitResults = filterBrexit(brexitElecReport,  dataRegions, dataConstituencies);

								console.log("Brexit Stats");
								console.log(overallBrexitResults);

								//By Default select ALL REgion
								filterRegion = {region_code:"ALL",
										region_name:"ALL REGIONS"
									}; 

								d3.select('#sel_region')
								.on('change', function() {	
									
									var region_name = this.value == "ALL"? "ALL REGIONS":dataRegions.filter(item => item.region_code == this.value)[0].region_name;
									filterRegion = {
										region_code : this.value,
										region_name : region_name
									} ;

									renderReport(overallBrexitResults, overallNalElecResults, filterRegion);										
								});

								renderReport(overallBrexitResults, overallNalElecResults, filterRegion);	

							}).catch(function(error) {
								console.log(error); 
							});

						}).catch(function(error) {
							//console.log(error); 
						});

					}).catch(function(error) {
						//console.log(error); 
					});

				}).catch(function(error) {
					//console.log(error); 
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
function renderReport(objReportBrexit, objReportNatlElec, filterRegion){

	renderSample(objReportBrexit, objReportNatlElec,filterRegion);
	renderRptHeader(objReportBrexit, objReportNatlElec, filterRegion);
	renderSummary(objReportBrexit, objReportNatlElec, filterRegion);
	renderDetails(objReportBrexit, objReportNatlElec, filterRegion);
	renderComparison(objReportBrexit, objReportNatlElec, filterRegion);
	renderComparison2(objReportBrexit, objReportNatlElec, filterRegion);
}

//Set report title/subtitles
function renderRptHeader(overallBrexitResults, objReportNatlElec,filterRegion){	
	//BREXIT
	d3.select("#election_1").select(".elname").text(overallBrexitResults.title);
	d3.select("#election_1").select(".elsubtitle").text(filterRegion.region_name);

	//NATIONAL ELECTION	
	d3.select("#election_2").select(".elname").text(objReportNatlElec[0].title);
	d3.select("#election_2").select(".elsubtitle").text(filterRegion.region_name);

}

function getElectionPercent(arrPercent, indx){	
	var arr = []
	arrPercent.forEach(function(pct) {		
		arr.push(pct[indx] * 100);
	});	
	return arr;
}

function filterElection(topWhat, regionalElecData,  regions, constituencies, ukparties){	

	
		reportDataRgn = regionalElecData.reportDataRegional;
		reportDataConst = regionalElecData.reportDataConst;
		//console.log("Report Data");
		
		//Get Unique Year in the report
		let arrYear = [...new Set(reportDataRgn.map(item => item.year))];
		
		var arrStat = [];

		var arrYearlyPartyVotes=[];

		//Get Yearly total votes for each party 
		for(i = 0; i < arrYear.length; i++){
			//Get Total vote counts for each party
			var arrPartyVotes = [];
			ukparties.forEach(function(party){
				var totalVotes = 0;					
				totalVotes = reportDataRgn.filter(item => item.party_code == party.party_code && item.year == arrYear[i])
						.map(item => parseFloat(item.party_vote))
						.reduce((sum, current) => sum + current, 0);					
				arrPartyVotes.push(
					{
						party_code: party.party_code,
						raw_party_votes: totalVotes
					}
				);
			})

			//Put party votes into the yearly party votes
			arrYearlyPartyVotes.push({
				year: arrYear[i],
				party_votes: arrPartyVotes.sort(compareValues("raw_party_votes","desc")),
				total_votes: 0,
				top_parties: []
			});
		}
	

		//Get top 3 parties for each year
		arrYearlyPartyVotes.forEach(function(ypVotes){
			//get yearly total
			var totalVotes  = ypVotes.party_votes.map(item => parseFloat(item.raw_party_votes))
					.reduce((sum, current) => sum + current, 0);

			ypVotes.total_votes = totalVotes;	
			ypVotes.top_parties = ypVotes.party_votes.slice(0,topWhat);
			
			var topPartiesVotes = ypVotes.top_parties.map(item => parseFloat(item.raw_party_votes))
			.reduce((sum, current) => sum + current, 0);

			//Add 'Others' Party
			ypVotes.top_parties.push({
				party_code: "Others",
				raw_party_votes: 0
			});

			ypVotes.top_parties[ypVotes.top_parties.length - 1].raw_party_votes =  totalVotes - topPartiesVotes;

			//compute top_parties %share 
			ypVotes.top_parties.forEach(function(tpvotes){
				tpvotes.party_percent = tpvotes.raw_party_votes/totalVotes;
			});

			//Get Regional Reports based on the top 3 parties
			var arrRegionalVotes = [];
			var region_top_party_percent = 0.0;
			regions.forEach(function(region){
				region_top_party_percent = 0.0;
				var regionVotes = {
					region_code: region.region_code,
					region_name: region.region_name,
					region_party_votes: [],
					constituency_votes: []
				};
				
				//Get regional party votes
				ypVotes.top_parties.forEach(function(party){
					var party_votes = {
						party_code: party.party_code,
						party_percent: 0.0
					};
					
					var regionData = {};
					if(party.party_code === "Others"){
						party_votes.party_percent = 1.0 - region_top_party_percent;
					}else{
						region_data = reportDataRgn.filter(item => item.party_code == party.party_code && item.year == ypVotes.year && item.region_code == region.region_code)[0];
						
						if(region_data != undefined){
							party_votes.party_percent = parseFloat(region_data.party_percent);	
							region_top_party_percent = region_top_party_percent + parseFloat(region_data.party_percent);
						}
					}
					regionVotes.region_party_votes.push(party_votes);					

				});

				//Get Constituency Votes
				var arrConstituency = constituencies.filter(c => c.region_code == region.region_code);
				var arrConstituencyVotes = [];
				var const_top_party_percent = 0.0;				
				
				arrConstituency.forEach(function(constituency){
					//console.log(constituency);
					const_top_party_percent = 0.0;
					var constVotes = {
						const_code: constituency.const_code,
						const_name: constituency.const_name,
						const_party_votes: []							
					};

					//Get regional party votes
					ypVotes.top_parties.forEach(function(party){
						var party_votes = {
							party_code: party.party_code,
							party_percent: 0.0
						};
						
						var regionData = {};
						if(party.party_code === "Others"){
							party_votes.party_percent = 1.0 - const_top_party_percent;
						}else{
							const_data = reportDataConst.filter(item => item.party_code == party.party_code && item.year == ypVotes.year && item.const_code == constituency.const_code)[0];
							if(const_data != undefined){
								party_votes.party_percent = parseFloat(const_data.party_percent);	
								const_top_party_percent = const_top_party_percent + parseFloat(const_data.party_percent);
							}
						}

						constVotes.const_party_votes.push(party_votes);					

					});

					arrConstituencyVotes.push(constVotes);
				});

				regionVotes.constituency_votes.push(arrConstituencyVotes);

				arrRegionalVotes.push(regionVotes);
			});

			ypVotes.regional_votes = arrRegionalVotes;
		})

		//console.log(arrYearlyPartyVotes);
		finalReportObject = [];
		var arrElecResult =  [];
		
		arrYearlyPartyVotes.forEach(function(elecData){
			var elecResult = {
				year: elecData.year,
				title: elecData.year + " UK Election",
				top_parties: {
					parties: elecData.top_parties.map(item => item.party_code),
					parties_percent: elecData.top_parties.map(item => item.party_percent)
				},
				regional_votes: {
					region_codes: elecData.regional_votes.map(item => item.region_code) ,
					region_names: elecData.regional_votes.map(item => item.region_name),
					region_parties: [], 					
					region_percent:[]			
				},

				regional_constituencies:[]
				
			};
		
			var arrRgnlPartiesCodes = [];
			var arrRgnlPartiesPercent = [];
			var arrRgnlConst = []; //array of regional constituencies

			elecData.regional_votes.forEach(function(regional_votes){
					var parties_code = regional_votes.region_party_votes.map(item => item.party_code);
					var parties_percent = regional_votes.region_party_votes.map(item => item.party_percent);
					arrRgnlPartiesCodes.push(parties_code);
					arrRgnlPartiesPercent.push(parties_percent);

					var objRgnlConst = {
						region_code: regional_votes.region_code,
						region_name: regional_votes.region_name,
						constituency_votes:{
							const_codes: [],
							const_names:[],
							const_parties:[],
							const_percent:[]
						}
					};

					var arrConstPartiesCodes = [];
					var arrConstPartiesPercent = [];
					regional_votes.constituency_votes.forEach(function(const_votes){
					
						//var parties_code = const_votes.const_party_votes.map(item => item.party_code);
						objRgnlConst.constituency_votes.const_codes = const_votes.map(item => item.const_code);
						objRgnlConst.constituency_votes.const_names = const_votes.map(item => item.const_name);
						
						const_votes.forEach(function(party_votes){								
							var parties_code = party_votes.const_party_votes.map(item => item.party_code);
							var parties_percent = party_votes.const_party_votes.map(item => item.party_percent);
							arrConstPartiesCodes.push(parties_code);
							arrConstPartiesPercent.push(parties_percent);
						});
													
					});

					objRgnlConst.constituency_votes.const_parties = arrConstPartiesCodes;
					objRgnlConst.constituency_votes.const_percent = arrConstPartiesPercent;

					arrRgnlConst.push(objRgnlConst);
			});				

			elecResult.regional_votes.region_parties = arrRgnlPartiesCodes;
			elecResult.regional_votes.region_percent = arrRgnlPartiesPercent;

			elecResult.regional_constituencies = arrRgnlConst;					
	
			arrElecResult.push(elecResult);			

		});

		return arrElecResult;

}


function filterBrexit(regionalBrxData,  regions, constituencies){

	reportDataRgn = regionalBrxData.reportDataRegional;
	reportDataConst = regionalBrxData.reportDataConst;
	

	var brexitResult = {
		year: 2016,
		title: "2016 Brexit Result",
		total_votes: 0,
		total_pct_leave: 0.0,
		total_pct_remain: 0.0,
		regional_votes:{},
		regional_constituencies:[]
	};


	//Populate regional votes
	brexitResult.regional_votes.region_codes = regions.map(item => item.region_code);
	brexitResult.regional_votes.region_names = regions.map(item => item.region_name);

	brexitResult.regional_votes.brexit_replies = ["LEAVE","REMAIN"];
	brexitResult.regional_votes.region_percent = [];


	var total_leave_votes =  reportDataRgn.map(item => parseFloat(item.vote_leave))
		.reduce((sum, current) => sum + current, 0);
	
	var total_remain_votes = reportDataRgn.map(item => parseFloat(item.vote_remain))
	.reduce((sum, current) => sum + current, 0);

	var total_votes = total_leave_votes + total_remain_votes;

	brexitResult.total_votes = total_votes;
	brexitResult.total_pct_leave = total_leave_votes/total_votes;
	brexitResult.total_pct_remain = total_remain_votes/total_votes;	

	brexitResult.regional_votes.region_codes.forEach(function(region_code){
		var arrVotes = [];
		
		arrVotes.push(parseFloat(reportDataRgn.filter(item => item.region_code == region_code)[0].percent_leave));
		arrVotes.push(parseFloat(reportDataRgn.filter(item => item.region_code == region_code)[0].percent_remain));
		brexitResult.regional_votes.region_percent.push(arrVotes);
		brexitResult.regional_constituencies.push({
			region_code: region_code,		
			region_name: regions.filter(item => item.region_code == region_code)[0].region_name,
			constituency_votes: {}
		})
		
	});

	//set constituency votes
	brexitResult.regional_constituencies.forEach(function(constituency){
		var arrConstCodes = [];
		var arrConstNames = [];
		arrConstCodes = constituencies.filter(item => item.region_code == constituency.region_code).map(item => item.const_code);
		arrConstNames = constituencies.filter(item => item.region_code == constituency.region_code).map(item => item.const_name);
		constituency.constituency_votes.const_codes = arrConstCodes;
		constituency.constituency_votes.const_names = arrConstNames;	
		constituency.constituency_votes.brexit_replies = ["LEAVE","REMAIN"];
		constituency.constituency_votes.const_percent = []
		
		arrConstCodes.forEach(function(const_code){
			var arrConstPercent = []
			arrConstPercent.push(parseFloat(reportDataConst.filter(item => item.const_code == const_code)[0].percent_leave));
			arrConstPercent.push(parseFloat(reportDataConst.filter(item => item.const_code == const_code)[0].percent_remain));
			constituency.constituency_votes.const_percent.push(arrConstPercent);
		});

	});

	return brexitResult;

}


function compareValues(key, order = 'asc') {
	return function innerSort(a, b) {
	  if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
		// property doesn't exist on either object
		return 0;
	  }
  
	  const varA = (typeof a[key] === 'string')
		? a[key].toUpperCase() : a[key];
	  const varB = (typeof b[key] === 'string')
		? b[key].toUpperCase() : b[key];
  
	  let comparison = 0;
	  if (varA > varB) {
		comparison = 1;
	  } else if (varA < varB) {
		comparison = -1;
	  }
	  return (
		(order === 'desc') ? (comparison * -1) : comparison
	  );
	};
  }