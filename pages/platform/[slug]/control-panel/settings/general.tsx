import PageWrapper from "@/components/wrappers/PageWrapper";
import PlatformWrapper from "@/components/wrappers/PlatformWrapper";
import PageTitle from "@/components/ui/PageTitle";
import SettingsWrapper from "@/components/wrappers/SettingsWrapper";
import Box from "@/components/ui/Box";

export default function GeneralSettingsPage() {
  return (
    <PageWrapper title='Indstillinger > Generelt'>
      <PlatformWrapper wrapperSize='large'>
        <PageTitle>Indstillinger</PageTitle>
        <SettingsWrapper>
          <Box title='Generelt'></Box>
        </SettingsWrapper>
      </PlatformWrapper>
    </PageWrapper>
  );
}
