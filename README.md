# backstopjs-failsonly
Script to reduce download size for backstopjs screenshots if you happy with a failure only report

This script asumes that it is located in `backstop_data/pipeline_scripts/error-report-only.sh` within your backstop test result.

By default this script creates a copy of `backstop_data` names `backstop_data_failonly`, which contains only the failed test, reference and diff pngs and an updated html_report with only failed tests.

```
error-report-only.sh
```

If the directory `backtop_data/../backstop_data_failonly/` exists you can delete and create a new copy with

```
error-report-only.sh --replace-existing
```

To keep things tiny the **copy** option uses a whitelist. 

```
'bitmaps_reference/**/*',
'bitmaps_test/**/*',
'html_report/**/*',
'!bitmaps_reference/test-sucess.png'
'!bitmaps_test/20210305-131059/test-sucess.png'
 ...
```

The **inplace** option might be faster.

It *deletes the successful* test and reference images and also updates html_report with only failed tests.

``` 
error-report-only.sh --inplace
```

**Pipeline usage example**

Intended use is to create two download assets `backstop_data` and `backstop_data_failonly` so you can download less if you want references for a few failed tests. 

```
mkdir -p backstopjs/backstop_data/pipeline_scripts/ \
&& wget https://raw.githubusercontent.com/digitaldonkey/backstopjs-failsonly/0.0.1-alpha/dist/error-report-only.sh?token=XXXXXXXXXXXXXXXXXXXXXXXXXXX -O backstopjs/backstop_data/pipeline_scripts/error-report-only.sh \
&& chmod a+x backstopjs/backstop_data/pipeline_scripts/error-report-only.sh \
&& backstopjs/backstop_data/pipeline_scripts/error-report-only.sh
# open backstopjs/backstop_data_failonly/html_report/index.html
```
