import PageWrapper from "../wrappers/PageWrapper";
import PlatformWrapper from "../wrappers/PlatformWrapper";

interface Props {
  size: string;
}

export default function PageLoading(props: Props) {
  return (
    <PageWrapper title=''>
      <PlatformWrapper wrapperSize={props.size}>
        <div className='bi-placeholder h-4 w-72 block mt-10'></div>
      </PlatformWrapper>
    </PageWrapper>
  );
}
