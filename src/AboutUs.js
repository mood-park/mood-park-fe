import React from 'react';
import { creators } from './CreatorsData.js';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, createFilterOptions, Divider } from '@mui/material';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';

export default function AboutUs() {
	return (
		<>
			<h1 sx={{ justifyContent: 'center' }}>TEAM PARKS</h1>

			<Stack
				direction={{ xs: 'column', sm: 'row' }}
				spacing={{ xs: 1, sm: 2, md: 4 }}
				sx={{ flexWrap: 'wrap' }}
				justifyContent='center'
				alignItems='center'
			>
				{creators.map((creator) => (
					<Card
						sx={{
							maxWidth: 345,
							minWidth: 345,
							minHeight: 450,
						}}
					>
						<CardActionArea>
							<CardMedia
								component='img'
								height='280'
								image={creator.image}
								alt={creator.name}
								alt='green iguana'
							/>
							<CardContent>
								<Typography gutterBottom variant='h5' component='div'>
									{creator.name}
								</Typography>
								<Typography variant='body2' color='text.secondary'>
									{creator.bio}
									<br />
									{creator.park}
								</Typography>
							</CardContent>
						</CardActionArea>
					</Card>
				))}
			</Stack>
		</>
	);
}
