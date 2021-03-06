const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

const chalk = require('chalk');
const fs = require('fs')
const path = require('path');
const JSONP = require('node-jsonp');

const copy = require('recursive-copy');


const error = (msg) => {
  console.log(chalk.red(msg));
  process.exit(1) 
}
const success = (msg) => {
  console.log(chalk.green(msg));
}
const warn = (msg) => {
  console.log(chalk.yellow(msg));
}


// Assuming backstop_data/pipeline here.
const backstopDataDir = path.resolve(__dirname + '/..') ;
success(`Backstop result source:\n ${backstopDataDir}`);

const htmlReportConfigSrc = backstopDataDir + '/html_report/config.js';
const report = {
  source: backstopDataDir,
  dest: null,
  config: '',
  configPath: '',
  files: [
     'bitmaps_reference/**/*',
     'bitmaps_test/**/*',
     'html_report/**/*',
   ],
};

const data = fs.readFileSync(htmlReportConfigSrc).toString();
// unwrap jsonp "report({... data ... });"
const result = JSON.parse(data.substring(7, (data.length - 2)));

 // Blacklist files from successful tests.
Object.values(result.tests).forEach((test) => {       
  if (test.status === 'pass') {
    report.files.push('!' + test.pair.test.substring(3))
    report.files.push('!' + test.pair.reference.substring(3))  
  }
})

// Update config
result.tests = Object.values(result.tests).filter(test => test.status !== 'pass');
report.config = `report(${JSON.stringify(result)});`

// Destination
if (argv.inplace) {
  warn('Override in place');
  report.dest = backstopDataDir;
  success(`Report destination:\n ${report.dest}`);
}
else {
  report.dest = path.resolve(backstopDataDir + '/..') + '/backstop_data_failonly';

  // Create a copy
  if (fs.existsSync(report.dest)) {
  
    if (argv['replace-existing']) {
      fs.rmdirSync(report.dest, {recursive: true});
	  success(`Report destination:\n  ${report.dest}`);
	  warn(`  Overriding Destination`);
    }
    else {
      error(`Destination already exists: ${report.dest}`);      
    }	
  }
}
report.configPath  = `${report.dest}/html_report/config.js`;

// Save reduced report to disc. 
if (argv.inplace) {

  report.files.forEach((p) => {  	
  	if (p.substring(0,1) === '!') {
  	  const fileName = p.substring(1)
  	  if (fs.existsSync(fileName)) {
  	    fs.unlink(fileName, (err) => {
          if (err) {
            error(err);
          }
          success(`Deleted: ${fileName}`)
     	});
  	  }
  	  else {
  	    warn(`Could not delete file:\n  ${fileName}`)
  	  }

  	}
  })
  fs.writeFileSync(report.configPath, report.config);
  console.log(chalk.green(`  Updated config:\n    ${report.configPath}`));
}
else {
copy(report.source , report.dest, {filter: report.files, expand: true})
  .then(function(results) {
    console.log(chalk.green(`  Copied ${results.length} files`));
    
    // Save updated jsonp test report. 
    fs.writeFileSync(report.configPath, report.config);
    console.log(chalk.green(`  Updated config:\n    ${report.configPath}`));
  })
  .catch(function(error) {
     error('Copy failed: ' + error);
  })
}
  