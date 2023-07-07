import * as Styled from '../support-page.styled';
import * as GlobalTypography from '../../../components/common/global-typography';
import CheckCircleIcon from '../../../components/common/icons/check-circle-icon';

interface IProps {
	isCopied: boolean;
	code: string;
}

const CopyToClipboardButton = ({ isCopied, code }: IProps) => {
	return (
		<>
			<Styled.TableContainer item container className={isCopied ? 'table-border' : ''}>
				<GlobalTypography.Text
					variant="overline"
					fontFamily="IBM Plex Sans"
					colorVariant="common.black"
					sx={{ fontSize: '0.6rem' }}
				>
					{code}
				</GlobalTypography.Text>
				{isCopied && (
					<Styled.IconWrapper>
						<CheckCircleIcon />
					</Styled.IconWrapper>
				)}
			</Styled.TableContainer>
		</>
	);
};
export default CopyToClipboardButton;
