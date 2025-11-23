import { Page1 } from '@/components/welcome/page1';
import { Page2 } from '@/components/welcome/page2';
import { Page3 } from '@/components/welcome/page3';
import { Page4 } from '@/components/welcome/Page4';
import { Page5 } from '@/components/welcome/Page5';
import { Page6 } from '@/components/welcome/Page6';
import { Page7 } from '@/components/welcome/Page7';
import React from 'react'

export const MainPage = ({ pageNumber, setPageNumber }: { pageNumber: number, setPageNumber: any }) => {
    switch (pageNumber) {
        case 1:
            return <Page1 pageNumber={pageNumber} setPageNumber={setPageNumber} />
            break;
        case 2:
            return <Page2 pageNumber={pageNumber} setPageNumber={setPageNumber} />
            break;
        case 3:
            return <Page3 pageNumber={pageNumber} setPageNumber={setPageNumber} />
            break;
        case 4:
            return <Page4 pageNumber={pageNumber} setPageNumber={setPageNumber} />
            break;
        case 5:
            return <Page5 pageNumber={pageNumber} setPageNumber={setPageNumber} />
            break;

        case 6:
            return <Page6 pageNumber={pageNumber} setPageNumber={setPageNumber} />
            break;
        case 7:
            return <Page7 />
            break;
        default:
            break;
    }

}
