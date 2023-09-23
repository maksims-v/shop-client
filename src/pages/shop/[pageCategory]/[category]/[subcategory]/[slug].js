import {
  Box,
  Button,
  IconButton,
  Typography,
  Divider,
  Breadcrumbs,
  ToggleButton,
  ToggleButtonGroup,
  CardActionArea,
  CardMedia,
} from '@mui/material';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useState, useCallback, useEffect, forwardRef } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Gallery from 'react-photo-gallery-next';
import ItemCarousel, { Modal, ModalGateway } from 'react-images';
import Link from 'next/link';
import { addToBasket } from '@/state/shoppingCartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import RelatedProductsSlider from 'components/RelatedProductsSlider';
import DoneIcon from '@mui/icons-material/Done';
import { getProductData } from '@/state/productPageSlice';
import ProductPageMobileVersion from 'components/mobileVersionPage/ProductPageMobileVersion';
import { useRouter } from 'next/router';

export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`${process.env.API_URL}/api/layout-header`);
  const data = await res.json();

  // Pass data to the page via props
  return { props: { data } };
}

const onHoverLine = {
  display: 'inline-block',
  position: 'relative',
  fontWeight: '400',
  '&:after': {
    content: "''",
    position: 'absolute',
    width: '100%',
    transform: 'scaleX(0)',
    height: '2px',
    bottom: '0',
    left: '0',
    backgroundColor: '#f5b950',
    transformOrigin: 'bottom right',
    transition: 'transform 0.25s ease-out',
  },
  '&:hover:after': {
    transform: 'scaleX(1)',
    transformOrigin: 'bottom left',
  },
};

const ItemDetails = ({ data }) => {
  const dispatch = useDispatch();

  console.log(data);

  const router = useRouter();
  const { category, pageCategory, subcategory, slug } = router.query;

  const basket = useSelector((state) => state.shoppingCartSlice.basket);
  const mobile = useSelector((state) => state.searchPageSlice.mobile);
  const productData = useSelector((state) => state.productPageSlice.productData);
  const status = useSelector((state) => state.productPageSlice.status);
  const similarProductData = useSelector((state) => state.productPageSlice.similarProductData);

  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setError] = useState(false);

  const [count, setCount] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [size, setSize] = useState(null);
  const [productQnty, setProductQnty] = useState(null);
  const [changeSizeColor, setChangeSizeColor] = useState('black');

  useEffect(() => {
    dispatch(getProductData({ slug, pageCategory }));
    setSize(null);
  }, [slug]);

  useEffect(() => {
    const basket = localStorage.getItem('cart');
    if (basket) dispatch(addToBasket(JSON.parse(basket)));
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSuccess(false);
    setError(false);
  };

  useEffect(() => {
    !size && setProductQnty(null);
    setChangeSizeColor('black');
  }, [size]);

  const addToBag = () => {
    if (size && productQnty !== 0) {
      const item = {
        item: productData.attributes,
        name: productData.attributes.slug,
        qnty: count,
        productSize: size,
        id: productData.id,
      };

      const product = basket
        .filter((item) => item.id === productData.id)
        .filter((item) => item.productSize === size);

      if (product.length === 0) {
        dispatch(addToBasket([...basket, item]));
      }
      setOpenSuccess(true);
    } else if (!size) {
      setError(true);
      setChangeSizeColor('red');
    }
  };

  const sizeHandleChange = (event, newAlignment) => {
    setSize(newAlignment);
  };

  const openLightbox = useCallback((event, { photo, index }) => {
    setCurrentImage(index);
  }, []);

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };

  const galleryArr = productData?.attributes?.image?.data
    ? productData.attributes?.image?.data?.map((item) => ({
        src: `${process.env.API_URL}${item?.attributes?.formats?.small?.url}`,
        width: 1,
        height: 1,
      }))
    : [{ src: ``, width: 1, height: 1 }];

  return mobile ? (
    <ProductPageMobileVersion
      productData={productData}
      pageCategory={pageCategory}
      category={category}
      subcategory={subcategory}
      slug={slug}
      similarProductData={similarProductData}
    />
  ) : (
    <Box width="100%" m="50px auto 10px auto">
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: '20px', mt: '20px' }}>
        <Link underline="hover" color="inherit" href="/">
          <Box sx={onHoverLine}>HOME</Box>
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href={`/shop/${productData?.attributes?.pageCategory}`}>
          <Box sx={onHoverLine}> {pageCategory?.toUpperCase()}</Box>
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href={`/shop/${productData?.attributes?.pageCategory}/${
            (productData?.attributes?.equipmentCategory !== 'null' &&
              productData?.attributes?.equipmentCategory) ||
            (productData?.attributes?.category !== 'null' && productData?.attributes?.category)
          }`}>
          <Box sx={onHoverLine}>{category?.toUpperCase()}</Box>
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href={`/shop/${productData?.attributes?.pageCategory}/${
            (productData?.attributes?.equipmentCategory !== 'null' &&
              productData?.attributes?.equipmentCategory) ||
            (productData?.attributes?.category !== 'null' && productData?.attributes?.category)
          }/${
            (productData?.attributes?.toolsGearCategory !== 'null' &&
              productData?.attributes?.toolsGearCategory) ||
            (productData?.attributes?.campSleepCategory !== 'null' &&
              productData?.attributes?.campSleepCategory) ||
            (productData?.attributes?.lampsLanternsCategory !== 'null' &&
              productData?.attributes?.lampsLanternsCategory) ||
            (productData?.attributes?.otherCategory !== 'null' &&
              productData?.attributes?.otherCategory) ||
            (productData?.attributes?.footwearCategory !== 'null' &&
              productData?.attributes?.footwearCategory) ||
            (productData?.attributes?.clothingCategory !== 'null' &&
              productData?.attributes?.clothingCategory) ||
            (productData?.attributes?.activityCategory !== 'null' &&
              productData?.attributes?.activityCategory) ||
            (productData?.attributes?.accessoriesCategory !== 'null' &&
              productData?.attributes?.accessoriesCategory)
          }`}>
          <Box sx={onHoverLine}>{subcategory?.toUpperCase()}</Box>
        </Link>
      </Breadcrumbs>
      <Box display="flex" flexWrap="wrap" columnGap="40px">
        <Box flex="1 1 50%">
          <Box
            sx={{
              ':hover': {
                cursor: 'pointer',
              },
            }}>
            <img
              onClick={() => setViewerIsOpen(true)}
              alt={'alt'}
              width="100%"
              height="500px"
              src={`${process.env.API_URL}${productData?.attributes?.image?.data[currentImage]?.attributes?.url}`}
              style={{ objectFit: 'contain' }}
            />
            <Box>
              <Box width={productData?.attributes?.image?.data?.length <= 2 ? '40%' : '100%'}>
                {status == 'resolved' && (
                  <Gallery
                    targetRowHeight={20}
                    thumbnailHeight={50}
                    photos={galleryArr}
                    onClick={openLightbox}
                  />
                )}
              </Box>
              <ModalGateway>
                {viewerIsOpen && status == 'resolved' ? (
                  <Modal onClose={closeLightbox}>
                    <ItemCarousel
                      currentIndex={currentImage}
                      views={
                        productData?.attributes.image?.data
                          ? productData.attributes.image.data?.map((item, i) => ({
                              src: `${process.env.API_URL}${item?.attributes?.url}`,
                            }))
                          : [{ src: '' }]
                      }
                    />
                  </Modal>
                ) : null}
              </ModalGateway>
            </Box>
          </Box>
        </Box>

        <Box flex="1 1 45%" mb="40px">
          <Box m="20px 0 25px 0">
            <Typography sx={{ mb: '8px', fontSize: '24px', fontWeight: 'bold' }} variant="h3">
              {productData?.attributes?.title}
            </Typography>

            <Divider sx={{ mb: '10px' }} color="yellow" />

            <Typography sx={{ fontSize: '38px', fontWeight: 'bold' }}>
              {productData?.attributes?.price} $
            </Typography>

            <Typography
              sx={{
                fontSize: '12px',
                pl: '5px',
                color: productData?.attributes?.oldPrice && 'red',
              }}>
              {productData?.attributes?.sale &&
                `Save:
              ${
                productData?.attributes?.sale &&
                (productData?.attributes?.price - productData?.attributes?.oldPrice).toFixed(2)
              }
              $`}
            </Typography>
            <Divider sx={{ mb: '10px', mt: '10px' }} color="yellow" />
            <Box sx={{ fontSize: '15px', fontWeight: 'bold', mb: '10px' }}>
              Choose color:{' '}
              <Typography component="span">
                {productData?.attributes?.color && productData.attributes.color.color}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: '10px' }}>
              {similarProductData &&
                similarProductData.data?.map((item, index) => (
                  <Link
                    key={item?.attributes.id}
                    href={`/shop/${item?.attributes?.pageCategory}/${
                      (item?.attributes?.category !== 'null' && item?.attributes?.category) ||
                      (item?.attributes?.equipmentCategory !== 'null' &&
                        item?.attributes?.equipmentCategory)
                    }/${
                      (item?.attributes?.toolsGearCategory !== 'null' &&
                        item?.attributes?.toolsGearCategory) ||
                      (item?.attributes?.campSleepCategory !== 'null' &&
                        item?.attributes?.campSleepCategory) ||
                      (item?.attributes?.lampsLanternsCategory !== 'null' &&
                        item?.attributes?.lampsLanternsCategory) ||
                      (item?.attributes?.footwearCategory !== 'null' &&
                        item?.attributes?.footwearCategory) ||
                      (item?.attributes?.clothingCategory !== 'null' &&
                        item?.attributes?.clothingCategory) ||
                      (item?.attributes?.otherCategory !== 'null' &&
                        item?.attributes?.otherCategory) ||
                      (item?.attributes?.activityCategory !== 'null' &&
                        item?.attributes?.activityCategory) ||
                      (item?.attributes?.accessoriesCategory !== 'null' &&
                        item?.attributes?.accessoriesCategory)
                    }/${item?.attributes?.slug}`}>
                    <CardActionArea sx={{ p: '0 15px' }}>
                      <CardMedia
                        component="img"
                        height="100"
                        image={`${process.env.API_URL}${item.attributes.image.data[0].attributes.formats.thumbnail.url}`}
                        alt="Paella dish"
                      />
                    </CardActionArea>
                  </Link>
                ))}
            </Box>
            <Box sx={{ fontSize: '15px', fontWeight: 'bold', mb: '10px', color: changeSizeColor }}>
              Choose size:
              <Box component="span" sx={{ pl: '3px', fontWeight: 'normal' }}>
                {' '}
                {size?.toUpperCase()}
              </Box>
              <Box component="span" sx={{ pl: '3px' }}>
                {}
                {productQnty > 0 && (
                  <>
                    <DoneIcon fontSize="small" sx={{ color: '#449d44', position: 'absolute' }} />
                    <Box
                      sx={{ fontWeight: 'normal', color: '#449d44', pl: '18px' }}
                      component="span">
                      {' '}
                      In stock!
                    </Box>
                  </>
                )}
                {productQnty === 0 && (
                  <Box sx={{ fontWeight: 'normal', color: 'red' }} component="span">
                    {' '}
                    Out of stock!
                  </Box>
                )}
              </Box>
            </Box>
            <Box mb="10px" maxWidth="300px">
              <ToggleButtonGroup
                color="primary"
                value={size}
                exclusive
                onChange={sizeHandleChange}
                aria-label="Platform">
                {productData?.attributes?.size?.map((item, index) => {
                  return (
                    <ToggleButton
                      key={item.id}
                      onClick={() => setProductQnty(item.qnty ? item.qnty : 0)}
                      color={item.qnty === 0 ? 'error' : 'success'}
                      value={item.size}>
                      {item.size}
                    </ToggleButton>
                  );
                })}
              </ToggleButtonGroup>
            </Box>
            {productQnty <= 5 ? (
              <Box
                sx={{
                  display: productQnty === null ? 'none' : 'block',
                  color: '#f07186',
                }}>
                Only {productQnty} units left
              </Box>
            ) : (
              <Box
                sx={{
                  display: productQnty === null ? 'none' : 'block',
                  color: '#5cb85b',
                }}>
                In stock {productQnty} units
              </Box>
            )}
            <ReactMarkdown>{productData?.attributes?.description}</ReactMarkdown>
            {productData?.attributes?.techDescription}
          </Box>

          <Divider sx={{ mb: '10px' }} color="yellow" />
          <Box display="flex" alignItems="center" minHeight="50px">
            <Box
              display="flex"
              alignItems="center"
              border="1.5px solid black"
              borderRadius="3px"
              mr="20px"
              p="2px 5px">
              <IconButton disabled={count === 1} onClick={() => setCount(count - 1)}>
                <RemoveIcon />
              </IconButton>
              <Typography sx={{ p: '0 5px' }}>{count}</Typography>
              <IconButton onClick={() => setCount(count + 1)}>
                <AddIcon />
              </IconButton>
            </Box>

            <Button
              onClick={addToBag}
              color="error"
              variant="outlined"
              sx={{
                borderRadius: 0,
                minWidth: '150px',
                padding: '10px 40px',
                borderRadius: '3px',
              }}>
              ADD TO CART
            </Button>
          </Box>
        </Box>
      </Box>

      <Box display="flex" flexWrap="wrap" gap="15px" mb="50px">
        <ReactMarkdown>{productData?.longDescription}</ReactMarkdown>
      </Box>

      <RelatedProductsSlider
        slug={slug}
        pageCategory={pageCategory}
        category={category}
        subcategory={subcategory}
        id={productData?.id && productData.id}
      />

      <Stack>
        <Snackbar open={openSuccess} autoHideDuration={2000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            The product has been placed in the cart
          </Alert>
        </Snackbar>
      </Stack>

      <Stack>
        <Snackbar open={openError} autoHideDuration={2000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            Please choose the size.
          </Alert>
        </Snackbar>
      </Stack>
    </Box>
  );
};

export default ItemDetails;

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
