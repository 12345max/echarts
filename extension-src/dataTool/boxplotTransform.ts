/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import { DataTransformOption, ExternalDataTransform } from '../../src/data/helper/transform';
import prepareBoxplotData from './prepareBoxplotData';
import { isArray, each } from 'zrender/src/core/util';
// import { throwError, makePrintable } from '../../src/util/log';


export interface BoxplotTransformOption extends DataTransformOption {
    type: 'echarts-extension:boxplot';
    config: {
        boundIQR?: number | 'none',
        layout?: 'horizontal' | 'vertical'
    }
}

export const boxplotTransform: ExternalDataTransform<BoxplotTransformOption> = {

    type: 'echarts-extension:boxplot',

    // PEDING: enhance to filter by index rather than create new data
    transform: function transform(params) {
        const source = params.source;
        const config = params.config || {};

        const sourceData = source.data;
        if (
            !isArray(sourceData)
            || (sourceData[0] && !isArray(sourceData[0]))
        ) {
            throw new Error(
                'source data is not applicable for this boxplot transform. Expect number[][].'
            );
        }

        const result = prepareBoxplotData(
            source.data as number[][],
            config
        );

        const boxData = result.boxData as (number | string)[][];
        each(boxData, function (item, dataIdx) {
            item.unshift(result.axisData[dataIdx]);
        });

        return [{
            data: boxData
        }, {
            data: result.outliers
        }];
    }
};
