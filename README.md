# backstopjs-failsonly
Script to reduce download size for backstopjs screenshots if you happy with a failure only report

This script asumes that it is located in `backstop_data/pipelines/error-report-only.sh` within your backstop test result. 

By default stis script creates a copy of `backstop_data` names `backstop_data_failonly`, which contains only the faild end test, reference and diff pngs and an updated html_report with only failed tests. 

```
error-report-only.sh
```

If directory `backtop_data/../backstop_data_failonly/` exists you can delete and create a new copy with

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

The **inplace** option it might be faster. 

It *deletes the successful* test and reference images and also updates html_report with only failed tests.

``` 
error-report-only.sh --inplace
```
