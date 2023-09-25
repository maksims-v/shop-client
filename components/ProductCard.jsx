import { Card, CardMedia, CardContent, Typography, CardActionArea, Box } from '@mui/material';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import Link from 'next/link';
import { useSelector } from 'react-redux';

const ProductCard = ({ item, clearence, section }) => {
  const mobile = useSelector((state) => state.searchPageSlice.mobile);

  return (
    <Card sx={{ maxWidth: 235, boxShadow: 'none' }}>
      <Link
        href={`/shop/${item?.pageCategory}/${
          (item?.category !== 'null' && item?.category) ||
          (item?.equipmentCategory !== 'null' && item?.equipmentCategory)
        }/${
          (item?.toolsGearCategory !== 'null' && item?.toolsGearCategory) ||
          (item?.campSleepCategory !== 'null' && item?.campSleepCategory) ||
          (item?.lampsLanternsCategory !== 'null' && item?.lampsLanternsCategory) ||
          (item?.footwearCategory !== 'null' && item?.footwearCategory) ||
          (item?.clothingCategory !== 'null' && item?.clothingCategory) ||
          (item?.otherCategory !== 'null' && item?.otherCategory) ||
          (item?.activityCategory !== 'null' && item?.activityCategory) ||
          (item?.accessoriesCategory !== 'null' && item?.accessoriesCategory)
        }/${item?.slug}`}>
        {section !== 'brandSection' ? (
          <CardActionArea
            sx={{ height: mobile ? 290 : 355, display: 'flex', flexDirection: 'column' }}>
            <CardMedia
              component="img"
              sx={{ p: '0px 2px', flex: '1 1 auto' }}
              image={`${
                clearence || section == 'brandSection'
                  ? item.image?.data[0]?.attributes?.formats?.medium?.url
                  : item?.image
              }`}
              alt="img"
            />

            {item.new && (
              <FiberNewIcon
                sx={{ color: '#0070d6', position: 'absolute', top: '7px', left: '7px' }}
              />
            )}

            <CardContent
              sx={{
                p: '0px 5px',
                textAlign: 'left',
                overflow: 'hidden',
                height: '100px',
                display: 'flex',
                flexDirection: 'column',
              }}>
              <Typography sx={{ fontWeight: 'bold' }}>{item?.brand}</Typography>
              <Typography sx={{ lineHeight: '15px', flex: '1 1 auto', overflow: 'hidden' }}>
                {item?.title}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  textAlign: 'left',
                }}>
                {item?.sale ? (
                  <Box display="flex">
                    <Typography
                      sx={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#bb3142',
                      }}>
                      {item?.price}$
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '13px',
                        pt: '9px',
                        textDecoration: 'line-through',
                      }}>
                      {item?.sale ? item?.oldPrice : item?.price} $
                    </Typography>
                  </Box>
                ) : (
                  <Typography
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '20px',
                      width: '100%',
                    }}>
                    {item?.price} $
                  </Typography>
                )}
              </Box>
            </CardContent>
          </CardActionArea>
        ) : (
          <>
            <CardMedia
              component="img"
              sx={{ p: '0px 5px' }}
              image={`${
                clearence || section == 'brandSection'
                  ? item.image?.data[0]?.attributes?.formats?.medium?.url
                  : item?.image
              }`}
              alt="img"
            />

            {item.new && (
              <FiberNewIcon
                sx={{ color: '#0070d6', position: 'absolute', top: '7px', left: '7px' }}
              />
            )}

            <CardContent
              sx={{
                p: '0px 5px',
                textAlign: 'left',
                overflow: 'hidden',
                height: '100px',
                display: 'flex',
                flexDirection: 'column',
              }}>
              <Typography sx={{ fontWeight: 'bold' }}>{item?.brand}</Typography>
              <Typography sx={{ lineHeight: '18px', flex: '1 1 auto' }}>{item?.title}</Typography>
              <Box
                sx={{
                  display: 'flex',
                  textAlign: 'left',
                }}>
                {item?.sale ? (
                  <Box display="flex">
                    <Typography
                      sx={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#bb3142',
                      }}>
                      {item?.price}$
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '13px',
                        pt: '9px',
                        textDecoration: 'line-through',
                      }}>
                      {item?.sale ? item?.oldPrice : item?.price} $
                    </Typography>
                  </Box>
                ) : (
                  <Typography
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '20px',
                      pt: '5px',
                      width: '100%',
                    }}>
                    {item?.price} $
                  </Typography>
                )}
              </Box>
            </CardContent>
          </>
        )}
      </Link>
    </Card>
  );
};

export default ProductCard;
