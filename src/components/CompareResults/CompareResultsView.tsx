import { useEffect } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';

import type { RootState } from '../../common/store';
import { useAppDispatch } from '../../hooks/app';
import useFetchCompareResults from '../../hooks/useFetchCompareResults';
import { fetchRevisionByID } from '../../thunks/searchThunk';
import { Repository, Revision } from '../../types/state';
import PerfCompareHeader from '../Shared/PerfCompareHeader';
import SelectedRevisionsTable from '../Shared/SelectedRevisionsTable';
import CompareResultsTable from './CompareResultsTable';

function CompareResultsView(props: CompareResultsViewProps) {
  const { revisions, mode } = props;
  const dispatch = useAppDispatch();

  const location = useLocation();
  const { dispatchFetchCompareResults } = useFetchCompareResults();

  // TODO: if the revisions in the URL parameters are different from
  // currently selected revisions, set selected revisions to those parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const repos = searchParams.get('repos')?.split(',');
    const revs = searchParams.get('revs')?.split(',');
    void dispatchFetchCompareResults(repos as Repository['name'][], revs);
  });

  useEffect(() => {
    const getRevId = async () => {
      const searchParams = new URLSearchParams(location.search);
      const repos = searchParams.get('repos')?.split(',') ?? [];
      const revs = searchParams.get('revs')?.split(',') ?? [];

      for (let i = 0; i < revs?.length; i++) {
        if (repos[i] !== undefined) {
          const revIC = await dispatch(
            fetchRevisionByID({
              repository: repos[i] as Repository['name'],
              search: revs[i],
            }),
          );
          console.log(revIC);
        }
      }
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getRevId();
    // revs?.forEach((revision, index) => {
    //   if (repos[index] !== undefined) {
    //     const revIC = fetchRevisionByID({
    //       repository: repos[index] as Repository['name'],
    //       search: revision,
    //     });
    //     console.log(revIC);
    //   }
    // });
  }, []);

  return (
    <Container maxWidth="xl">
      <PerfCompareHeader />
      <Grid container alignItems="center" justifyContent="center">
        <Grid item xs={10}>
          {revisions.length >= 0 && (
            <SelectedRevisionsTable view="compare-results" />
          )}
        </Grid>
        <Grid item xs={12}>
          <CompareResultsTable mode={mode} />
        </Grid>
      </Grid>
    </Container>
  );
}

interface CompareResultsViewProps {
  revisions: Revision[];
  mode: 'light' | 'dark';
}

function mapStateToProps(state: RootState) {
  return {
    revisions: state.selectedRevisions.revisions,
  };
}

export default connect(mapStateToProps)(CompareResultsView);
