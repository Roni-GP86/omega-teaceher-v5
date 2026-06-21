import fs from 'fs';
import path from 'path';

import { htmlPart1, htmlPart3, htmlPart4, htmlPart5 } from './src/utils/htmlBuilderData1';
import { htmlPart6, htmlPart7, htmlPart8, htmlPart9, htmlPart10, htmlPart11 } from './src/utils/htmlBuilderData2';
import { htmlPart2 } from './src/utils/htmlBuilderData3';

const finalHtml = htmlPart1 + htmlPart2 + htmlPart3 + htmlPart4 + htmlPart5 + htmlPart6 + htmlPart7 + htmlPart8 + htmlPart9 + htmlPart10 + htmlPart11;
fs.writeFileSync(path.join(process.cwd(), 'public', 'rpm_builder.html'), finalHtml);
console.log('Successfully wrote public/rpm_builder.html');
