import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { sessionAPI } from '../api/UserAPI';
import { selectUser, assignUser } from '../redux/userSlice';
import User from '../types/User';

export default function useUser(requireRedirect = false): User {
  const userInStore = useSelector(selectUser);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    // redux store에 user가 저장되어 있는지 확인
    if (!userInStore.userId) {
      // redux store에 없음 | session에 user가 저장되어 있는지 확인
      const fetchUserFromSession = async () => {
        try {
          const session = await sessionAPI();
          if (session?.succeeded) {
            // session에 있음 | session에 저장된 user 정보를 redux store에 저장
            dispatch(assignUser(session.user));
          } else if (requireRedirect) {
            // session에 없음 | main page로 redirect
            history.push('/');
          }
        } catch (e) {
          alert('세션 값을 불러오는 과정에서 에러가 발생했습니다.');
        }
      };

      fetchUserFromSession();
    }
  }, [userInStore, history, dispatch, requireRedirect]);

  return userInStore;
}
