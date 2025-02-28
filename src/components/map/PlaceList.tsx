import styled from "styled-components";

interface Place {
  id: number;
  name: string;
  description: string;
  imageUrl: string | null;
  days: number;
}

interface PlaceListProps {
  data: Place[];
  currentPage: number;
}

export default function PlaceList({ data, currentPage }: PlaceListProps) {
  const filteredPlaces = data.filter((place) => place.days === currentPage);

  const getImageUrl = (place: Place): string =>
    place.imageUrl && place.imageUrl.trim() !== ""
      ? place.imageUrl
      : "https://via.placeholder.com/80?text=No+Image";

  return (
    <ListContainer>
      {filteredPlaces.map((place, index) => (
        <PlaceCard key={place.id}>
          <NumberBadge>{index + 1}</NumberBadge>
          <Image
            src={getImageUrl(place)}
            alt={place.name}
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              
                target.src = "N_else.png";
              
            }}
          />
          <TextContainer>
            <Title>{place.name}</Title>
            <Description>{place.description}</Description>
          </TextContainer>
        </PlaceCard>
      ))}
    </ListContainer>
  );
}

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  height: 100%;
  align-items: center;
  overflow-y: auto;
`;

const PlaceCard = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  background: white;
  border-radius: 20px;
  padding: 16px;
  border: 1px solid lightgray;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 400px;
  margin-top: 10px;
  margin-left: 5px;
`;

const NumberBadge = styled.div`
  position: absolute;
  top: -8px;
  left: -8px;
  background: #ff6b6b;
  color: white;
  font-size: 14px;
  font-weight: bold;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Image = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 10px;
  object-fit: cover;
`;

const TextContainer = styled.div`
  margin-left: 12px;
`;

const Title = styled.h3`
  font-size: 14px;
  font-weight: bold;
  margin: 0;
`;

const Description = styled.p`
  font-size: 12px;
  color: gray;
  margin: 4px 0 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
`;
