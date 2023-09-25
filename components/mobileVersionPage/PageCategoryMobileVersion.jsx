import { Box, Breadcrumbs } from '@mui/material';
import ProductList from 'components/ProductList';
import Link from 'next/link';
import MobileFilters from 'components/filtersComponents/MobileFilters';

const PageCategoryMobileVersion = ({ clearFilters, pageCategory }) => {
  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: '5px', mt: '20px', pl: '5px' }}>
        <Link underline="hover" color="inherit" href="/">
          HOME
        </Link>
        <Link
          underline="hover"
          style={{ fontWeight: 'bold' }}
          color="inherit"
          href={`/shop/${pageCategory}`}>
          {pageCategory?.toUpperCase()}
        </Link>
      </Breadcrumbs>
      <Box display="flex" alignContent="center" flexDirection="column">
        <MobileFilters clearFilters={clearFilters} />
        <ProductList />
      </Box>
    </Box>
  );
};

export default PageCategoryMobileVersion;
