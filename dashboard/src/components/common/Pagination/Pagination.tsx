import Input from '@/components/ui/v2/Input';
import Button from '@/ui/v2/Button';
import ChevronLeftIcon from '@/ui/v2/icons/ChevronLeftIcon';
import ChevronRightIcon from '@/ui/v2/icons/ChevronRightIcon';
import Text from '@/ui/v2/Text';
import type { ButtonProps } from '@mui/material';
import type { DetailedHTMLProps, HTMLProps } from 'react';
import { twMerge } from 'tailwind-merge';

export type PaginationProps = DetailedHTMLProps<
  HTMLProps<HTMLDivElement>,
  HTMLDivElement
> & {
  /**
   * Total number of pages.
   */
  totalNrOfPages: number;
  /**
   * Current page number.
   */
  currentPageNumber: number;
  /**
   * Function to be called when navigating to the previous page.
   */
  onPrevPageClick: VoidFunction;
  /**
   * Function to be called when navigating to the next page.
   */
  onNextPageClick: VoidFunction;
  /**
   * Props to be passed to the next button component.
   */
  nextButtonProps?: ButtonProps;
  /**
   * Props to be passed to the previous button component.
   */
  prevButtonProps?: ButtonProps;
  /**
   * Props to be passed to the previous button component.
   */
  onChangePage: (page: number) => void;
};

export default function Pagination({
  className,
  totalNrOfPages,
  currentPageNumber,
  onPrevPageClick,
  onNextPageClick,
  nextButtonProps,
  prevButtonProps,
  onChangePage,
  ...props
}: PaginationProps) {
  return (
    <div
      className={twMerge(
        'grid grid-flow-col items-center justify-start gap-x-2',
        className,
      )}
      {...props}
    >
      <Button
        variant="outlined"
        color="secondary"
        className="block text-xs"
        disabled={currentPageNumber === 1}
        aria-label="Previous page"
        onClick={onPrevPageClick}
      >
        <ChevronLeftIcon className="w-4 h-4" />
        Back
      </Button>

      <div className="grid grid-cols-3 gap-1 text-center grid-col">
        <Text className="self-center text-xs align-middle text-greyscaleGreyDark">
          Page
        </Text>
        <Input
          value={currentPageNumber}
          onChange={(e) => {
            const page = parseInt(e.target.value, 10);
            if (page > 0 && page <= totalNrOfPages) {
              onChangePage(page);
            }
          }}
          disabled={totalNrOfPages === 1}
          color="secondary"
          sx={{
            width: 28,
            height: 28,
          }}
          componentsProps={{
            formControl: {
              className: 'flex flex-row-reverse text-center',
            },
          }}
          slotProps={{
            input: {
              style: {
                fontSize: '0.70rem',
              },
            },
          }}
        />
        <Text className="self-center text-xs align-middle text-greyscaleGreyDark">
          of {totalNrOfPages}
        </Text>
      </div>

      <Button
        variant="outlined"
        color="secondary"
        className="text-xs"
        disabled={currentPageNumber === totalNrOfPages}
        aria-label="Next page"
        onClick={onNextPageClick}
      >
        Next
        <ChevronRightIcon className="w-4 h-4" />
      </Button>
    </div>
  );
}
